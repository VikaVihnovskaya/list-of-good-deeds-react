import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/axios';
import { User, AuthState } from '@/types/user';

const TOKEN_KEY = 'token';

function saveToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 3600}`;
}

function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

function decodeUser(token: string): User {
  const payload = jwtDecode<{ sub: number; email: string; name: string; tag: string }>(token);
  return { id: payload.sub, email: payload.email, name: payload.name, tag: payload.tag };
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string; tag: string }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.post<{ access_token: string }>('/auth/register', data);
      return res.access_token;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message ?? 'Registration failed');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.post<{ access_token: string }>('/auth/login', data);
      return res.access_token;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message ?? 'Login failed');
    }
  },
);

export const fetchMe = createAsyncThunk('auth/me', async () => {
  const { data } = await api.get<User>('/auth/me');
  return data;
});

export const updateMe = createAsyncThunk(
  'auth/update',
  async (data: { name?: string; password?: string }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.put<User>('/auth/me', data);
      return res;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message ?? 'Update failed');
    }
  },
);

export const deleteMe = createAsyncThunk('auth/delete', async () => {
  await api.delete('/auth/me');
});

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      clearToken();
    },
    restoreAuth(state) {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        state.token = token;
        state.user = decodeUser(token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        state.user = decodeUser(action.payload);
        saveToken(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        state.user = decodeUser(action.payload);
        saveToken(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(updateMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteMe.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        clearToken();
      });
  },
});

export const { logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
