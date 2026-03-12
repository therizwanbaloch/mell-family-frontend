import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initAuth } from '../api'

// ── Async: login on app start ────────────────────────────────
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (_, { rejectWithValue }) => {
    try {
      const token = await initAuth()
      return token
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ── Slice ────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    loading: false,   // true while logging in
    error: null,      // error message if login fails
    ready: false,     // true once login succeeded
  },
  reducers: {
    clearAuth(state) {
      state.token = null
      state.ready = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload
        state.ready = true
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.ready = false
      })
  }
})

export const { clearAuth } = authSlice.actions
export default authSlice.reducer