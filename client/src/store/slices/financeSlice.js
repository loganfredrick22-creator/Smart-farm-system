import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financeAPI } from '../../services/api';

export const fetchTransactions = createAsyncThunk('finance/fetchTransactions', async (params, { rejectWithValue }) => {
  try { const res = await financeAPI.listTransactions(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createTransaction = createAsyncThunk('finance/createTransaction', async (data, { rejectWithValue }) => {
  try { const res = await financeAPI.createTransaction(data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    transactions: [], total: 0, page: 1, totalPages: 1,
    budgets: [], summary: null, categoryBreakdown: [],
    loading: false, error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false; state.transactions = action.payload.items;
        state.total = action.payload.total; state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTransactions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTransaction.fulfilled, (state, action) => { state.transactions.unshift(action.payload); });
  },
});

export default financeSlice.reducer;
