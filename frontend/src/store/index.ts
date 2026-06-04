import { configureStore } from '@reduxjs/toolkit';
import deedsReducer from './deedsSlice';

export const store = configureStore({
  reducer: {
    deeds: deedsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
