import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Habit } from '../../../shared/types';

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  loading: false,
  error: null,
};

// Async thunks for habit operations
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (_, { rejectWithValue }) => {
    try {
      const habits = await window.electronAPI.habit.getAll();
      return habits;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch habits');
    }
  }
);

export const createHabit = createAsyncThunk(
  'habits/createHabit',
  async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const habit = await window.electronAPI.habit.create(habitData);
      return habit;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create habit');
    }
  }
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async ({ id, updates }: { id: string; updates: Partial<Habit> }, { rejectWithValue }) => {
    try {
      await window.electronAPI.habit.update(id, updates);
      return { id, updates };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update habit');
    }
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (id: string, { rejectWithValue }) => {
    try {
      await window.electronAPI.habit.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete habit');
    }
  }
);

export const logHabitCompletion = createAsyncThunk(
  'habits/logHabitCompletion',
  async ({ habitId, count = 1 }: { habitId: string; count?: number }, { rejectWithValue, dispatch }) => {
    try {
      const habitLog = await window.electronAPI.habit.log(habitId, count);
      // Refresh habits to get updated streak information
      dispatch(fetchHabits());
      return habitLog;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to log habit completion');
    }
  }
);

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch habits
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create habit
      .addCase(createHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.loading = false;
        state.habits.unshift(action.payload);
      })
      .addCase(createHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update habit
      .addCase(updateHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;
        const habitIndex = state.habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
          state.habits[habitIndex] = { ...state.habits[habitIndex], ...updates };
        }
      })
      .addCase(updateHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete habit
      .addCase(deleteHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = state.habits.filter(habit => habit.id !== action.payload);
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Log habit completion
      .addCase(logHabitCompletion.pending, (state) => {
        state.error = null;
      })
      .addCase(logHabitCompletion.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = habitsSlice.actions;
export default habitsSlice.reducer;
