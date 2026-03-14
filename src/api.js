// ============================================================
// src/api.js — MELL FAMILY API Service  (DEV MODE)
// ============================================================

// const BASE_URL  = 'http://localhost:8000'
const BASE_URL  = 'https://mell-family-backend.onrender.com'
const TOKEN_KEY = 'mell_api_token'
const DEV_USER_ID = 999999

// ── Token storage ────────────────────────────────────────────
function getStoredToken()      { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } }
function setStoredToken(token) { try { localStorage.setItem(TOKEN_KEY, token) } catch {} }
function clearStoredToken()    { try { localStorage.removeItem(TOKEN_KEY) }     catch {} }

// ── Dev login ────────────────────────────────────────────────
async function devLogin() {
  const res = await fetch(`${BASE_URL}/api/dev/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ user_id: DEV_USER_ID }),
  })
  if (!res.ok) throw new Error(`Dev login failed (${res.status})`)
  const data = await res.json()
  if (!data?.token) throw new Error('No token in response')
  setStoredToken(data.token)
  return data.token
}

// ── Get token (cached or fresh) ──────────────────────────────
async function getToken(forceRefresh = false) {
  if (!forceRefresh) {
    const existing = getStoredToken()
    if (existing) return existing
  }
  return devLogin()
}

// ── Core fetch wrapper ───────────────────────────────────────
async function apiFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const body   = options.body !== undefined ? options.body : null

  const doRequest = async (token) => {
    const headers = { Authorization: `Bearer ${token}` }
    if (body !== null) headers['Content-Type'] = 'application/json'
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== null ? JSON.stringify(body) : undefined,
    })
    if (res.status === 401) throw new Error('AUTH_401')
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      let detail = text
      try { detail = JSON.parse(text)?.detail || text } catch {}
      throw new Error(detail || `HTTP ${res.status}`)
    }
    return res.json()
  }

  try {
    return await doRequest(await getToken(false))
  } catch (err) {
    if (err.message === 'AUTH_401') {
      clearStoredToken()
      return await doRequest(await getToken(true))
    }
    throw err
  }
}

// ── Exports ──────────────────────────────────────────────────
export async function initAuth()      { return getToken(false) }
export async function reLogin()       { clearStoredToken(); return devLogin() }

export async function getState()      { return apiFetch('/api/state') }
export async function tap(count = 1)  { return apiFetch('/api/tap', { method: 'POST', body: { count } }) }

export async function upgradeCharacter(key)             { return apiFetch('/api/upgrade/character',   { method: 'POST', body: { key } }) }
export async function upgradeImprovement(charKey, slot) { return apiFetch('/api/upgrade/improvement', { method: 'POST', body: { char_key: charKey, slot } }) }

export async function claimDaily()    { return apiFetch('/api/claim/daily', { method: 'POST' }) }

export async function storeBuy(key, qty = 1) { return apiFetch('/api/store/buy',      { method: 'POST', body: { key, qty } }) }
export async function openBox(boxType)        { return apiFetch('/api/store/open_box', { method: 'POST', body: { box_type: boxType } }) }

export async function claimDrunRoad() { return apiFetch('/api/drunroad/claim', { method: 'POST' }) }

export async function getTournaments()                 { return apiFetch('/api/tournaments/current') }
export async function getTicketLeaderboard(limit = 50) { return apiFetch(`/api/tournaments/ticket/leaderboard?limit=${limit}`) }
export async function getUsdtLeaderboard(limit = 50)   { return apiFetch(`/api/tournaments/usdt/leaderboard?limit=${limit}`) }
export async function syncUsdtTickets(tickets)         { return apiFetch('/api/tournaments/usdt/sync', { method: 'POST', body: { tickets: Math.floor(tickets) } }) }
export async function placeBet(amount)                 { return apiFetch('/api/tournaments/bet',       { method: 'POST', body: { amount: Math.floor(amount) } }) }