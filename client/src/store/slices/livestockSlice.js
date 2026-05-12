import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { livestockAPI } from '../../services/api';

export const fetchLivestock = createAsyncThunk('livestock/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await livestockAPI.list(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createLivestock = createAsyncThunk('livestock/create', async (data, { rejectWithValue }) => {
  try { const res = await livestockAPI.create(data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const livestockSlice = createSlice({
  name: 'livestock',
  initialState: { items: [], total: 0, page: 1, totalPages: 1, loading: false, error: null, stats: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLivestock.pending, (state) => { state.loading = true; })
      .addCase(fetchLivestock.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLivestock.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createLivestock.fulfilled, (state, action) => { state.items.unshift(action.payload); });
  },
});

export default livestockSlice.reducer;
