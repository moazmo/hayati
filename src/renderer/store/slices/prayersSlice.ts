import { createSlice } from '@reduxjs/toolkit';

const prayersSlice = createSlice({
  name: 'prayers',
  initialState: {
    prayerTimes: null,
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},
});

export default prayersSlice.reducer;
