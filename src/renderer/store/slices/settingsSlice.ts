import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    language: 'ar',
    theme: 'light',
    notifications: true,
    location: {
      latitude: 30.0444,
      longitude: 31.2357,
      city: 'Cairo',
    },
  },
  reducers: {
    updateLanguage: (state, action) => {
      state.language = action.payload;
    },
    updateTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { updateLanguage, updateTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
