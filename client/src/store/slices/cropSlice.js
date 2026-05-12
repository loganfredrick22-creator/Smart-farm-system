import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cropAPI } from '../../services/api';

export const fetchCrops = createAsyncThunk('crops/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await cropAPI.list(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createCrop = createAsyncThunk('crops/create', async (data, { rejectWithValue }) => {
  try { const res = await cropAPI.create(data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cropSlice = createSlice({
  name: 'crops',
  initialState: { items: [], total: 0, page: 1, totalPages: 1, loading: false, error: null, stats: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrops.pending, (state) => { state.loading = true; })
      .addCase(fetchCrops.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload.items; state.total = action.payload.total;
        state.page = action.payload.page; state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCrops.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createCrop.fulfilled, (state, action) => { state.items.unshift(action.payload); });
  },
});

export default cropSlice.reducer;
