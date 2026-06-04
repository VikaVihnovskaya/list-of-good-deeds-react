import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { Deed } from '@/types/deed';

export const fetchDeeds = createAsyncThunk('deeds/fetchAll', async () => {
  const { data } = await api.get<Deed[]>('/deeds');
  return data;
});

export const createDeed = createAsyncThunk(
  'deeds/create',
  async (payload: { title: string; description?: string }) => {
    const { data } = await api.post<Deed>('/deeds', payload);
    return data;
  },
);

export const toggleDeed = createAsyncThunk(
  'deeds/toggle',
  async ({ id, completed }: { id: number; completed: boolean }) => {
    const { data } = await api.put<Deed>(`/deeds/${id}`, { completed });
    return data;
  },
);

export const deleteDeed = createAsyncThunk('deeds/delete', async (id: number) => {
  await api.delete(`/deeds/${id}`);
  return id;
});

interface DeedsState {
  items: Deed[];
  loading: boolean;
  error: string | null;
}

const initialState: DeedsState = {
  items: [],
  loading: false,
  error: null,
};

const deedsSlice = createSlice({
  name: 'deeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeeds.fulfilled, (state, action: PayloadAction<Deed[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch deeds';
      })
      .addCase(createDeed.fulfilled, (state, action: PayloadAction<Deed>) => {
        state.items.unshift(action.payload);
      })
      .addCase(toggleDeed.fulfilled, (state, action: PayloadAction<Deed>) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteDeed.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export default deedsSlice.reducer;
