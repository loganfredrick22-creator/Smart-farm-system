import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { alertAPI } from '../../services/api';

export const fetchAlerts = createAsyncThunk('alerts/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await alertAPI.list(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const alertSlice = createSlice({
  name: 'alerts',
  initialState: { items: [], total: 0, page: 1, totalPages: 1, loading: false, error: null, unreadCount: 0 },
  reducers: {
    addAlert: (state, action) => { state.items.unshift(action.payload); },
    setUnreadCount: (state, action) => { state.unreadCount = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => { state.loading = true; })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload.items;
        state.total = action.payload.total; state.page = action.payload.page; state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAlerts.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { addAlert, setUnreadCount } = alertSlice.actions;
export default alertSlice.reducer;
