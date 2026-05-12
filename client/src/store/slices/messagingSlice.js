import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messagingAPI } from '../../services/api';

export const fetchConversations = createAsyncThunk('messaging/fetchConversations', async (_, { rejectWithValue }) => {
  try { const res = await messagingAPI.listConversations(); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const sendMessage = createAsyncThunk('messaging/send', async (data, { rejectWithValue }) => {
  try { const res = await messagingAPI.sendMessage(data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const messagingSlice = createSlice({
  name: 'messaging',
  initialState: { conversations: [], activeConversation: null, messages: [], loading: false, error: null, unreadCount: 0 },
  reducers: {
    setActiveConversation: (state, action) => { state.activeConversation = action.payload; },
    addMessage: (state, action) => { state.messages.push(action.payload); },
    setMessages: (state, action) => { state.messages = action.payload; },
    setUnreadCount: (state, action) => { state.unreadCount = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => { state.conversations = action.payload; })
      .addCase(sendMessage.fulfilled, (state, action) => { state.messages.push(action.payload.message); });
  },
});

export const { setActiveConversation, addMessage, setMessages, setUnreadCount } = messagingSlice.actions;
export default messagingSlice.reducer;
