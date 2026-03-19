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

// ── Async Thunks ─────────────────────────────

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
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await claimDaily()
      dispatch(fetchState())
      return res
    } catch (err) {
      return rejectWithValue(err.message)
    }
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

// ── Slice ───────────────────────────────────

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    user: null,
    rates: null,
    characters: null,
    improvements: null,
    inventory: null,
    tournaments: null,
    ticketLeaderboard: [],
    usdtLeaderboard: [],
    stateLoading: false,
    stateError: null,
    actionLoading: false,
    actionError: null,
  },

  reducers: {
    clearActionError(state) {
      state.actionError = null
    },
    patchUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },

  extraReducers: (builder) => {
    // ── fetchState ──
    builder
      .addCase(fetchState.pending, (state) => {
        state.stateLoading = true
      })
      .addCase(fetchState.fulfilled, (state, action) => {
        state.stateLoading = false
        const data = action.payload
        state.user = data.user ?? state.user
        state.rates = data.rates ?? state.rates
        state.characters = data.characters ?? state.characters
        state.improvements = data.improvements ?? state.improvements
        state.inventory = data.inventory ?? state.inventory
        state.tournaments = data.tournaments ?? state.tournaments
      })
      .addCase(fetchState.rejected, (state, action) => {
        state.stateLoading = false
        state.stateError = action.payload
      })

    // ── fetchTournaments (FIXED) ──
    builder.addCase(fetchTournaments.fulfilled, (state, action) => {
      state.tournaments = action.payload
    })

    // ── doTap ──
    builder.addCase(doTap.fulfilled, (state, action) => {
      if (action.payload?.user) {
        state.user = { ...state.user, ...action.payload.user }
      }
    })

    // ── DAILY CLAIM ──
    builder
      .addCase(doClaimDaily.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(doClaimDaily.fulfilled, (state, action) => {
        state.actionLoading = false
        const reward = action.payload
        if (reward?.user) {
          state.user = { ...state.user, ...reward.user }
        } else if (reward?.amount && state.user) {
          state.user.balance = (state.user.balance || 0) + reward.amount
        }
        if (reward?.tickets && state.user) {
          state.user.tickets = (state.user.tickets || 0) + reward.tickets
        }
      })
      .addCase(doClaimDaily.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload
      })

    // ── Other actions ──
    const actionCases = [
      doUpgradeCharacter,
      doUpgradeImprovement,
      doStoreBuy,
      doOpenBox,
      doClaimDrunRoad
    ]
    actionCases.forEach(thunk => {
      builder
        .addCase(thunk.pending, (state) => { state.actionLoading = true })
        .addCase(thunk.fulfilled, (state) => { state.actionLoading = false })
        .addCase(thunk.rejected, (state, action) => {
          state.actionLoading = false
          state.actionError = action.payload
        })
    })

    // ── Leaderboards ──
    builder
      .addCase(fetchTicketLeaderboard.fulfilled, (state, action) => {
        state.ticketLeaderboard = action.payload || []
      })
      .addCase(fetchUsdtLeaderboard.fulfilled, (state, action) => {
        state.usdtLeaderboard = action.payload || []
      })
  },
})

export const { clearActionError, patchUser } = gameSlice.actions
export default gameSlice.reducer