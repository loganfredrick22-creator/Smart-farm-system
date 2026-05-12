import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { healthAPI } from '../../services/api';

export const fetchHealthRecords = createAsyncThunk('health/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await healthAPI.list(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const healthSlice = createSlice({
  name: 'health',
  initialState: { items: [], total: 0, page: 1, totalPages: 1, loading: false, error: null, openCases: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthRecords.pending, (state) => { state.loading = true; })
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload.items;
        state.total = action.payload.total; state.page = action.payload.page; state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default healthSlice.reducer;
