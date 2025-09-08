import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import habitsReducer from './slices/habitsSlice';
import prayersReducer from './slices/prayersSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    habits: habitsReducer,
    prayers: prayersReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
