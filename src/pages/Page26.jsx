import React, { useState, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { patchUser } from '../redux/gameSlice'

import fishkiIcon  from '../assets/page22Images/fa-icon.webp'
import windowClose from '../assets/page26Images/window-bg.webp'
import windowOpen  from '../assets/page26Images/window-open.webp'
import monsterImg  from '../assets/page26Images/monster.webp'
import coinImg     from '../assets/page26Images/coin.webp'

const TOTAL_CELLS = 25
const MAX_BET     = 4000
const MIN_BET     = 1

const G        = '#53a00d'
const G_DARK   = '#2e5a07'
const G_LIGHT  = '#6cc418'
const G_BORDER = '#68c214'

function calcMultiplier(bombs, safeRevealed) {
  if (safeRevealed === 0) return 1.00
  let prob = 1.0
  for (let i = 0; i < safeRevealed; i++) {
    prob *= (TOTAL_CELLS - bombs - i) / (TOTAL_CELLS - i)
  }
  return +((1 / prob) * 0.95).toFixed(2)
}

function buildMultTable(bombs) {
  const rows = []
  for (let i = 1; i <= Math.min(TOTAL_CELLS - bombs, 7); i++) {
    rows.push({ step: i, mult: calcMultiplier(bombs, i) })
  }
  return rows
}

function placeMines(count) {
  const pos = new Set()
  while (pos.size < count) pos.add(Math.floor(Math.random() * TOTAL_CELLS))
  return pos
}

/* ── Cell ── */
const Cell = React.memo(({ idx, cellState, onReveal, disabled }) => {
  const hidden = cellState === 'hidden'
  const isSafe = cellState === 'safe'
  const isMine = cellState === 'mine'
  const isOpen = isSafe || isMine

  return (
    <div
      onClick={() => hidden && !disabled && onReveal(idx)}
      style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', cursor: hidden && !disabled ? 'pointer' : 'default' }}
    >
      {/* CLOSED */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden',
        transition: 'transform 0.28s ease, opacity 0.18s ease',
        transform: isOpen ? 'rotateY(90deg)' : 'rotateY(0deg)',
        opacity: isOpen ? 0 : 1,
        pointerEvents: isOpen ? 'none' : 'auto',
      }}>
        <img src={windowClose} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(180deg,#4a4a5a,#2a2a38)' }}
        />
      </div>

      {/* OPEN */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden',
        transition: 'transform 0.28s ease 0.07s, opacity 0.18s ease 0.07s',
        transform: isOpen ? 'rotateY(0deg)' : 'rotateY(-90deg)',
        opacity: isOpen ? 1 : 0,
        border: isMine ? '2px solid #dd2020' : isSafe ? `2px solid ${G_BORDER}` : 'none',
      }}>
        <img src={windowOpen} alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = isMine ? '#0f0000' : '#011208' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isMine && (
            <img src={monsterImg} alt="💀"
              style={{ width: '80%', height: '80%', objectFit: 'cover', borderRadius: 4 }}
              onError={e => { const s = document.createElement('span'); s.textContent = '💀'; s.style.fontSize = '16px'; e.target.replaceWith(s) }}
            />
          )}
          {isSafe && (
            <img src={coinImg} alt="🪙"
              style={{ width: '64%', height: '64%', objectFit: 'contain' }}
              onError={e => { const s = document.createElement('span'); s.textContent = '🪙'; s.style.fontSize = '16px'; e.target.replaceWith(s) }}
            />
          )}
        </div>
      </div>
    </div>
  )
})

export default function Page26() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const chips    = useSelector(s => s.game.user?.chips ?? s.game.user?.fishki_balance ?? 0)
  const chipsRef = useRef(chips)
  chipsRef.current = chips

  const [phase,       setPhase]       = useState('idle')
  const [bombs,       setBombs]       = useState(3)
  const [bet,         setBet]         = useState(179)
  const [cells,       setCells]       = useState(Array(25).fill('hidden'))
  const [mines,       setMines]       = useState(new Set())
  const [safeCount,   setSafeCount]   = useState(0)
  const [currentMult, setCurrentMult] = useState(1.00)
  const [winAmount,   setWinAmount]   = useState(null)
  const [toast,       setToast]       = useState(null)

  const showToast = (msg, isErr = false) => {
    setToast({ msg, isErr })
    setTimeout(() => setToast(null), 2200)
  }

  const updateChips = useCallback((v) => {
    dispatch(patchUser({ chips: Math.max(0, Math.round(v)) }))
  }, [dispatch])

  const adjustBet = (d) => {
    if (phase === 'playing') return
    setBet(b => Math.min(MAX_BET, Math.max(MIN_BET, b + d)))
  }

  const handleBet = useCallback(() => {
    if (phase !== 'idle') return
    if (chipsRef.current < bet) { showToast('Недостаточно Фишек!', true); return }
    updateChips(chipsRef.current - bet)
    setMines(placeMines(bombs))
    setCells(Array(25).fill('hidden'))
    setSafeCount(0); setCurrentMult(1.00); setWinAmount(null)
    setPhase('playing')
  }, [phase, bet, bombs, updateChips])

  const handleCashout = useCallback(() => {
    if (phase !== 'playing' || safeCount === 0) return
    const mult = calcMultiplier(bombs, safeCount)
    const win  = Math.round(bet * mult)
    updateChips(chipsRef.current + win)
    setWinAmount(win); setPhase('won')
    showToast(`🎉 +${win.toLocaleString()} Фишек!`)
    setMines(prev => {
      setCells(c => { const n = [...c]; prev.forEach(i => { if (n[i] === 'hidden') n[i] = 'mine' }); return n })
      return prev
    })
  }, [phase, safeCount, bombs, bet, updateChips])

  const handleCancel = useCallback(() => {
    if (phase !== 'playing') return
    if (safeCount > 0) { handleCashout(); return }
    updateChips(chipsRef.current + bet)
    showToast('Ставка отменена')
    setPhase('idle'); setCells(Array(25).fill('hidden'))
  }, [phase, safeCount, bet, updateChips, handleCashout])

  const handleReveal = useCallback((idx) => {
    if (phase !== 'playing') return
    setMines(cur => {
      const isMine = cur.has(idx)
      setCells(prev => { const n = [...prev]; n[idx] = isMine ? 'mine' : 'safe'; return n })
      if (isMine) {
        setTimeout(() => setCells(prev => {
          const n = [...prev]; cur.forEach(m => { if (n[m] === 'hidden') n[m] = 'mine' }); return n
        }), 220)
        setPhase('lost')
        showToast('💥 Мина! Ставка потеряна.', true)
      } else {
        setSafeCount(prev => {
          const ns = prev + 1
          const nm = calcMultiplier(bombs, ns)
          setCurrentMult(nm)
          if (ns >= TOTAL_CELLS - bombs) {
            const win = Math.round(bet * nm)
            updateChips(chipsRef.current + win)
            setWinAmount(win); setPhase('won')
            showToast(`🏆 +${win.toLocaleString()} Фишек`)
          }
          return ns
        })
      }
      return cur
    })
  }, [phase, bombs, bet, updateChips])

  const handleNewGame = () => {
    setPhase('idle'); setCells(Array(25).fill('hidden'))
    setSafeCount(0); setCurrentMult(1.00); setWinAmount(null); setMines(new Set())
  }

  const isPlaying = phase === 'playing'
  const isOver    = phase === 'won' || phase === 'lost'
  const multTable = buildMultTable(bombs)

  const actionStyle = isPlaying && safeCount > 0
    ? { bg: 'linear-gradient(180deg,#e8a020,#9a6010)', border: '#f5c030', shadow: 'rgba(240,160,20,0.45)' }
    : isPlaying
      ? { bg: 'linear-gradient(180deg,#cc1010,#7a0808)', border: '#ee2020', shadow: 'rgba(200,20,20,0.45)' }
      : { bg: `linear-gradient(180deg,${G_LIGHT},${G_DARK})`, border: G_BORDER, shadow: `${G}70` }

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto',
      height: '100dvh',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: '#111',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>

      {/* ╔══════════════════════════════╗
          ║   SECTION 1 — 20dvh          ║
          ║   Header + Title + Bomb+Chips ║
          ╚══════════════════════════════╝ */}
      <div style={{
        height: '20dvh',
        flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* DRUN FAMILY header */}
        <div style={{
          flexShrink: 0, textAlign: 'center',
          background: 'linear-gradient(180deg,#1e1e1e,#141414)',
          borderBottom: '1px solid #2a2a2a',
          padding: '4px 0 2px',
        }}>
          <div style={{ fontWeight: 900, color: '#fff', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            DRUN FAMILY
          </div>
          <div style={{ color: '#555', fontSize: 8, letterSpacing: '0.2em' }}>game</div>
        </div>

        {/* Title pill */}
        <div style={{ flexShrink: 0, padding: '4px 10px 3px' }}>
          <div style={{
            textAlign: 'center', borderRadius: 12,
            background: 'linear-gradient(180deg,#e8e8e8,#c0c0c0)',
            border: '3px solid #aaa', padding: '3px 0',
          }}>
            <span style={{ fontWeight: 900, fontStyle: 'italic', color: '#111', fontSize: 'clamp(16px,5vw,24px)', letterSpacing: '0.02em' }}>
              FOG x MINES
            </span>
          </div>
        </div>

        {/* Bomb + Chips — fills rest of 20% zone */}
        <div style={{
          flex: 1, minHeight: 0,
          display: 'flex', gap: 7, padding: '0 10px 4px', alignItems: 'center',
        }}>
          {/* Bomb pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            background: 'linear-gradient(180deg,#c40000,#7a0000)',
            border: '2px solid #ff4040', borderRadius: 10,
            padding: '3px 11px', height: '100%', boxSizing: 'border-box',
          }}>
            <span style={{ fontSize: 15 }}>💣</span>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>{bombs}</span>
          </div>

          {/* Chips bar */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 6,
            background: `linear-gradient(180deg,${G_DARK},#0c3000)`,
            border: `2px solid ${G}`, borderRadius: 16,
            padding: '3px 6px 3px 8px',
            height: '100%', boxSizing: 'border-box',
          }}>
            <img src={fishkiIcon} alt="" style={{
              width: 24, height: 24, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid #f0c020', flexShrink: 0,
            }} onError={e => e.target.style.display = 'none'} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 7, letterSpacing: '0.1em' }}>ФИШКИ</div>
              <div style={{ color: '#fff', fontWeight: 900, lineHeight: 1, fontSize: 'clamp(12px,3.8vw,17px)' }}>
                {chips.toLocaleString()}
              </div>
            </div>
            <button onClick={() => navigate('/page21')} style={{
              width: 26, height: 26, borderRadius: 7, flexShrink: 0,
              background: `linear-gradient(180deg,${G_LIGHT},${G_DARK})`,
              border: `2px solid ${G_BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: 18, cursor: 'pointer',
            }}>+</button>
          </div>
        </div>
      </div>

      {/* ╔══════════════════════════════╗
          ║   SECTION 2 — 40dvh          ║
          ║   5×5 Window Grid             ║
          ╚══════════════════════════════╝ */}
      <div style={{
        height: '40dvh',
        flexShrink: 0,
        padding: '0 10px 6px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%', height: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(5, 1fr)',
          gap: 5,
          background: 'linear-gradient(180deg,#1c1c1c,#141414)',
          border: '2px solid #252525',
          borderRadius: 14,
          padding: 7,
          boxSizing: 'border-box',
        }}>
          {cells.map((state, idx) => (
            <Cell key={idx} idx={idx} cellState={state} onReveal={handleReveal} disabled={!isPlaying} />
          ))}
        </div>
      </div>

      {/* ╔══════════════════════════════╗
          ║   SECTION 3 — 40dvh          ║
          ║   Odds + Status + Bet + Bombs ║
          ╚══════════════════════════════╝ */}
      <div style={{
        height: '40dvh',
        flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        padding: '0 10px 8px',
        gap: 5,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>

        {/* ODDS BAR */}
        <div style={{ flexShrink: 0, display: 'flex', gap: 4 }}>
          {multTable.map(({ step, mult }) => {
            const active = safeCount >= step
            return (
              <div key={step} style={{
                flex: 1, borderRadius: 9, padding: '3px 1px', textAlign: 'center',
                background: active
                  ? `linear-gradient(180deg,${G_LIGHT},${G_DARK})`
                  : 'linear-gradient(180deg,#b4b4b4,#909090)',
                border: active ? `1.5px solid ${G_BORDER}` : '1.5px solid #888',
                transition: 'all 0.18s ease',
                boxShadow: active ? `0 2px 6px ${G}55` : '0 1px 2px rgba(0,0,0,0.3)',
              }}>
                <div style={{ fontWeight: 900, lineHeight: 1, color: active ? '#d0ffb0' : '#333', fontSize: 9 }}>{step}</div>
                <div style={{ fontWeight: 900, lineHeight: 1.2, color: active ? '#fff' : '#222', fontSize: 9 }}>x{mult}</div>
              </div>
            )
          })}
        </div>

        {/* STATUS BANNER — only shown when relevant */}
        {(isOver || (isPlaying && safeCount > 0)) && (
          <div style={{
            flexShrink: 0,
            borderRadius: 9, padding: '3px 10px',
            textAlign: 'center', fontWeight: 900, fontSize: 11,
            background: phase === 'won' ? 'rgba(10,50,4,0.97)' : phase === 'lost' ? 'rgba(60,4,4,0.97)' : 'rgba(10,40,4,0.9)',
            border: `1.5px solid ${phase === 'lost' ? '#cc1818' : G}`,
            color: phase === 'lost' ? '#ff5050' : '#7ade30',
          }}>
            {phase === 'won'  && `🎉 +${winAmount?.toLocaleString()} Фишек выиграно!`}
            {phase === 'lost' && `💥 Мина! -${bet.toLocaleString()} Фишек потеряно`}
            {isPlaying && safeCount > 0 && `x${currentMult} → ${Math.round(bet * currentMult).toLocaleString()} Фишек`}
          </div>
        )}

        {/* BET PANEL — flex:1 takes all remaining space in bottom section */}
        <div style={{
          flex: 1, minHeight: 0,
          background: 'linear-gradient(180deg,#1e1e1e,#141414)',
          border: '1.5px solid #2a2a2a',
          borderRadius: 14, padding: '7px 10px',
          display: 'flex',
        }}>
          {!isOver ? (
            <div style={{ display: 'flex', gap: 9, width: '100%' }}>

              {/* Left: − amount + and 2×2 quick bets */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* − bet + */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => adjustBet(-1)} disabled={isPlaying} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(180deg,#333,#222)', border: '1.5px solid #555',
                    color: '#fff', fontWeight: 900, fontSize: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isPlaying ? 'default' : 'pointer', opacity: isPlaying ? 0.3 : 1,
                    flexShrink: 0,
                  }}>−</button>
                  <span style={{
                    color: '#fff', fontWeight: 900, textAlign: 'center',
                    minWidth: 52, fontSize: 'clamp(14px,4.5vw,20px)',
                  }}>
                    {bet.toLocaleString()}
                  </span>
                  <button onClick={() => adjustBet(1)} disabled={isPlaying} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(180deg,#333,#222)', border: '1.5px solid #555',
                    color: '#fff', fontWeight: 900, fontSize: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isPlaying ? 'default' : 'pointer', opacity: isPlaying ? 0.3 : 1,
                    flexShrink: 0,
                  }}>+</button>
                </div>

                {/* 2×2 quick bets */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                  {[1, 5, 20, 100].map((v, i) => (
                    <button key={v} onClick={() => !isPlaying && setBet(Math.min(v, MAX_BET))} disabled={isPlaying} style={{
                      borderRadius: 9, padding: '5px 0',
                      fontWeight: 900, fontSize: 13, color: '#fff',
                      cursor: isPlaying ? 'default' : 'pointer',
                      opacity: isPlaying ? 0.3 : 1,
                      background: i === 3
                        ? `linear-gradient(180deg,${G_LIGHT},${G_DARK})`
                        : 'linear-gradient(180deg,#2e2e2e,#1a1a1a)',
                      border: i === 3 ? `1.5px solid ${G_BORDER}` : '1.5px solid #3a3a3a',
                    }}>{v}</button>
                  ))}
                </div>
              </div>

              {/* Right: big action button — full height */}
              <button
                onClick={isPlaying ? (safeCount > 0 ? handleCashout : handleCancel) : handleBet}
                style={{
                  flex: 1,
                  borderRadius: 14,
                  border: `2.5px solid ${actionStyle.border}`,
                  background: actionStyle.bg,
                  color: '#fff', fontWeight: 900,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: `0 4px 14px ${actionStyle.shadow}`,
                }}
              >
                <span style={{ fontSize: 'clamp(18px,5.5vw,26px)', lineHeight: 1.1 }}>
                  {isPlaying && safeCount > 0 ? 'Вывести' : isPlaying ? 'Отменить' : 'Ставка'}
                </span>
                <span style={{ fontSize: 11, opacity: 0.82, fontWeight: 700, marginTop: 2 }}>
                  {isPlaying && safeCount > 0
                    ? `x${currentMult} = ${Math.round(bet * currentMult).toLocaleString()}`
                    : `${bet.toLocaleString()} Фишек`}
                </span>
              </button>
            </div>
          ) : (
            <button onClick={handleNewGame} style={{
              width: '100%',
              borderRadius: 14,
              background: `linear-gradient(180deg,${G_LIGHT},${G_DARK})`,
              border: `2.5px solid ${G_BORDER}`,
              color: '#fff', fontWeight: 900,
              fontSize: 'clamp(15px,5vw,19px)',
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${G}66`,
            }}>🎮 Новая игра</button>
          )}
        </div>

        {/* BOMB COUNT SELECTOR */}
        <div style={{
          flexShrink: 0,
          background: 'linear-gradient(180deg,#1e1e1e,#141414)',
          border: '1.5px solid #2a2a2a',
          borderRadius: 12, padding: '6px 10px',
        }}>
          <div style={{ color: '#bbb', fontWeight: 700, fontSize: 11, marginBottom: 4 }}>Количество бомб</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[2, 3, 5, 7].map(n => {
              const sel = bombs === n
              return (
                <button key={n} onClick={() => !isPlaying && setBombs(n)} disabled={isPlaying} style={{
                  flex: 1, padding: '5px 0', borderRadius: 10,
                  fontWeight: 900, fontSize: 16,
                  background: sel ? 'linear-gradient(180deg,#606060,#383838)' : 'linear-gradient(180deg,#1e1e1e,#111)',
                  border: sel ? '2px solid #888' : '1.5px solid #2e2e2e',
                  color: sel ? '#fff' : '#555',
                  cursor: isPlaying && !sel ? 'default' : 'pointer',
                  opacity: isPlaying && !sel ? 0.3 : 1,
                  transition: 'all 0.15s',
                }}>{n}</button>
              )
            })}
          </div>
        </div>

      </div>{/* end section 3 */}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 70, left: '50%',
          transform: 'translateX(-50%)',
          background: toast.isErr ? '#7a0000' : G_DARK,
          border: `1.5px solid ${toast.isErr ? '#dd2020' : G}`,
          color: '#fff', fontWeight: 700, fontSize: 13,
          borderRadius: 20, padding: '6px 18px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
          zIndex: 9999, whiteSpace: 'nowrap', pointerEvents: 'none',
          animation: 'fogToast 0.22s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fogToast {
          from { opacity:0; transform:translateX(-50%) translateY(10px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}