import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getState,
  tap,
  upgradeCharacter,
  upgradeImprovement,
  claimDaily,
  storeBuy,
  openBox,
  claimDrunRoad,
  getTournaments,
  getTicketLeaderboard,
  getUsdtLeaderboard,
  syncUsdtTickets,
  placeBet,
} from '../api'

// ── Async Thunks ─────────────────────────────────────────────

export const fetchState = createAsyncThunk(
  'game/fetchState',
  async (_, { rejectWithValue }) => {
    try { return await getState() }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doTap = createAsyncThunk(
  'game/tap',
  async (count = 1, { rejectWithValue }) => {
    try { return await tap(count) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doUpgradeCharacter = createAsyncThunk(
  'game/upgradeCharacter',
  async (key, { rejectWithValue }) => {
    try { return await upgradeCharacter(key) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doUpgradeImprovement = createAsyncThunk(
  'game/upgradeImprovement',
  async ({ charKey, slot }, { rejectWithValue }) => {
    try { return await upgradeImprovement(charKey, slot) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doClaimDaily = createAsyncThunk(
  'game/claimDaily',
  async (_, { rejectWithValue }) => {
    try { return await claimDaily() }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doStoreBuy = createAsyncThunk(
  'game/storeBuy',
  async ({ key, qty = 1 }, { rejectWithValue }) => {
    try { return await storeBuy(key, qty) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doOpenBox = createAsyncThunk(
  'game/openBox',
  async (boxType, { rejectWithValue }) => {
    try { return await openBox(boxType) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doClaimDrunRoad = createAsyncThunk(
  'game/claimDrunRoad',
  async (_, { rejectWithValue }) => {
    try { return await claimDrunRoad() }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const fetchTournaments = createAsyncThunk(
  'game/fetchTournaments',
  async (_, { rejectWithValue }) => {
    try { return await getTournaments() }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const fetchTicketLeaderboard = createAsyncThunk(
  'game/fetchTicketLeaderboard',
  async (limit = 8, { rejectWithValue }) => {
    try { return await getTicketLeaderboard(limit) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const fetchUsdtLeaderboard = createAsyncThunk(
  'game/fetchUsdtLeaderboard',
  async (limit = 8, { rejectWithValue }) => {
    try { return await getUsdtLeaderboard(limit) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doSyncUsdtTickets = createAsyncThunk(
  'game/syncUsdtTickets',
  async (tickets, { rejectWithValue }) => {
    try { return await syncUsdtTickets(tickets) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const doPlaceBet = createAsyncThunk(
  'game/placeBet',
  async (amount, { rejectWithValue }) => {
    try { return await placeBet(amount) }
    catch (err) { return rejectWithValue(err.message) }
  }
)

// ── Slice ────────────────────────────────────────────────────

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    user:               null,
    rates:              null,
    characters:         null,
    improvements:       null,
    inventory:          null,
    tournaments:        null,
    ticketLeaderboard:  [],
    usdtLeaderboard:    [],
    stateLoading:       false,
    stateError:         null,
    actionLoading:      false,
    actionError:        null,
  },

  reducers: {
    // clear any action error shown in UI
    clearActionError(state) {
      state.actionError = null
    },

    // patch any fields on state.user without a full re-fetch
    // Used by slots/games for optimistic balance updates.
    //
    // Usage:
    //   dispatch(patchUser({ fa: newVal }))
    //   dispatch(patchUser({ chips: newVal }))
    //   dispatch(patchUser({ chips: newChips, usdt: newUsdt }))
    patchUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },

  extraReducers: (builder) => {

    // ── fetchState ──────────────────────────────────────────
    builder
      .addCase(fetchState.pending, (state) => {
        state.stateLoading = true
        state.stateError   = null
      })
      .addCase(fetchState.fulfilled, (state, action) => {
        state.stateLoading = false
        const data = action.payload
        state.user         = data.user         ?? state.user
        state.rates        = data.rates        ?? state.rates
        state.characters   = data.characters   ?? state.characters
        state.improvements = data.improvements ?? state.improvements
        state.inventory    = data.inventory    ?? state.inventory
      })
      .addCase(fetchState.rejected, (state, action) => {
        state.stateLoading = false
        state.stateError   = action.payload
      })

    // ── doTap ───────────────────────────────────────────────
    builder
      .addCase(doTap.pending,   (state) => { state.actionLoading = true })
      .addCase(doTap.fulfilled, (state, action) => {
        state.actionLoading = false
        if (action.payload?.user) {
          state.user = { ...state.user, ...action.payload.user }
        }
      })
      .addCase(doTap.rejected,  (state, action) => {
        state.actionLoading = false
        state.actionError   = action.payload
      })

    // ── doUpgradeCharacter ──────────────────────────────────
    builder
      .addCase(doUpgradeCharacter.pending,   (state) => { state.actionLoading = true })
      .addCase(doUpgradeCharacter.fulfilled, (state) => { state.actionLoading = false })
      .addCase(doUpgradeCharacter.rejected,  (state, action) => {
        state.actionLoading = false
        state.actionError   = action.payload
      })

    // ── doUpgradeImprovement ────────────────────────────────
    builder
      .addCase(doUpgradeImprovement.pending,   (state) => { state.actionLoading = true })
      .addCase(doUpgradeImprovement.fulfilled, (state) => { state.actionLoading = false })
      .addCase(doUpgradeImprovement.rejected,  (state, action) => {
        state.actionLoading = false
        state.actionError   = action.payload
      })

    // ── doClaimDaily ────────────────────────────────────────
    builder
      .addCase(doClaimDaily.pending,   (state) => { state.actionLoading = true })
      .addCase(doClaimDaily.fulfilled, (state) => { state.actionLoading = false })
      .addCase(doClaimDaily.rejected,  (state, action) => {
        state.actionLoading = false
        state.actionError   = action.payload
      })

    // ── doStoreBuy ──────────────────────────────────────────
    builder
      .addCase(doStoreBuy.pending,   (state) => { state.actionLoading = true })
      .addCase(doStoreBuy.fulfilled, (state) => { state.actionLoading = false })
      .addCase(doStoreBuy.rejected,  (state, action) => {
        state.actionLoading = false
        state.actionError   = action.payload
      })

    // ── doOpenBox ───────────────────────────────────────────
    builder
      .addCase(doOpenBox.pending,   (state) => { state.actionLoading = true })
      .addCase(doOpenBox.fulfilled, (state) => { state.actionLoading = false })
      .addCase(doOpenBox.rejected,  (state, action) => {
        state.actionLoading = false
        state.actionError   = action.payload
      })

    // ── doClaimDrunRoad ─────────────────────────────────────
    builder
      .addCase(doClaimDrunRoad.pending,   (state) => { state.actionLoading = true })
      .addCase(doClaimDrunRoad.fulfilled, (state) => { state.actionLoading = false })
      .addCase(doClaimDrunRoad.rejected,  (state, action) => {
        state.actionLoading = false
        state.actionError   = action.payload
      })

    // ── tournaments / leaderboards ──────────────────────────
    builder
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.tournaments = action.payload
      })
      .addCase(fetchTicketLeaderboard.fulfilled, (state, action) => {
        const p = action.payload
        state.ticketLeaderboard = Array.isArray(p)
          ? p
          : (p?.leaderboard ?? p?.entries ?? p?.players ?? [])
      })
      .addCase(fetchUsdtLeaderboard.fulfilled, (state, action) => {
        state.usdtLeaderboard = action.payload
      })

    // ── doPlaceBet ──────────────────────────────────────────
    builder
      .addCase(doPlaceBet.pending,   (state) => { state.actionLoading = true })
      .addCase(doPlaceBet.fulfilled, (state) => { state.actionLoading = false })
      .addCase(doPlaceBet.rejected,  (state, action) => {
        state.actionLoading = false
        state.actionError   = action.payload
      })
  },
})

export const { clearActionError, patchUser } = gameSlice.actions
export default gameSlice.reducer