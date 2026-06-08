import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { Friend, FriendsState } from '@/types/friend';
import { Deed } from '@/types/deed';

export const fetchFriends = createAsyncThunk('friends/fetchAll', async () => {
  const { data } = await api.get<Friend[]>('/friends');
  return data;
});

export const addFriend = createAsyncThunk(
  'friends/add',
  async (tag: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post<Friend>('/friends', { tag });
      return data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message ?? 'Failed to add friend');
    }
  },
);

export const removeFriend = createAsyncThunk('friends/remove', async (friendId: number) => {
  await api.delete(`/friends/${friendId}`);
  return friendId;
});

export const fetchFriendDeeds = createAsyncThunk(
  'friends/deeds',
  async (friendId: number) => {
    const { data } = await api.get<Deed[]>(`/friends/${friendId}/deeds`);
    return data;
  },
);

const initialState: FriendsState = {
  items: [],
  loading: false,
  error: null,
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearFriendsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action: PayloadAction<Friend[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load friends';
      })
      .addCase(addFriend.fulfilled, (state, action: PayloadAction<Friend>) => {
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeFriend.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((f) => f.id !== action.payload);
      });
  },
});

export const { clearFriendsError } = friendsSlice.actions;
export default friendsSlice.reducer;
