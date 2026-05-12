import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import livestockReducer from './slices/livestockSlice';
import cropReducer from './slices/cropSlice';
import financeReducer from './slices/financeSlice';
import healthReducer from './slices/healthSlice';
import messagingReducer from './slices/messagingSlice';
import alertReducer from './slices/alertSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    livestock: livestockReducer,
    crops: cropReducer,
    finance: financeReducer,
    health: healthReducer,
    messaging: messagingReducer,
    alerts: alertReducer,
    ui: uiReducer,
  },
});

export default store;
