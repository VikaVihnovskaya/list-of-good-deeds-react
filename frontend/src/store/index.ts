import { configureStore } from '@reduxjs/toolkit';
import deedsReducer from './deedsSlice';
import authReducer from './authSlice';
import friendsReducer from './friendsSlice';

export const store = configureStore({
  reducer: {
    deeds: deedsReducer,
    auth: authReducer,
    friends: friendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
