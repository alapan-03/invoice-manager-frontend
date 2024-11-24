import { configureStore } from '@reduxjs/toolkit';
import invoicesReducer from '../features/invoices/invoicesSlice';

const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
  },
});

export default store;
