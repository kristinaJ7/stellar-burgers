import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../root-reducer';

// Тип состояния пользователя
export type UserState = {
  name?: string;
  isAuthenticated: boolean;
  token?: string;
  loading: boolean;
  error?: string;
};

// Начальное состояние
const initialState: UserState = {
  name: undefined,
  isAuthenticated: false,
  token: undefined,
  loading: false,
  error: undefined
};

// Асинхронное действие для логина
export const loginThunk = createAsyncThunk<
  { name: string; token: string },
  { username: string; password: string },
  { rejectValue: string }
>('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch(
      'https://norma.education-services.ru/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }
    );

    if (!response.ok) {
      return rejectWithValue('Ошибка авторизации');
    }

    const data = await response.json();

    if (!data.name || !data.token) {
      return rejectWithValue('Неверный формат ответа сервера');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Неизвестная ошибка при авторизации');
  }
});

// Единый thunk для загрузки данных пользователя
export const loadUserDataThunk = createAsyncThunk<
  { name: string } | null,
  void,
  { rejectValue: string }
>('user/loadUserData', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      'https://norma.education-services.ru/api/auth/user',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      return rejectWithValue(`Ошибка загрузки данных: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.name) {
      return { name: data.name };
    } else if (data.user?.name) {
      return { name: data.user.name };
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(`Ошибка сети: ${error.message}`);
    }
    return rejectWithValue('Неизвестная ошибка при загрузке данных');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Действие для выхода из системы
    logout: (state) => {
      state.name = undefined;
      state.isAuthenticated = false;
      state.token = undefined;
      state.loading = false;
      state.error = undefined;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка loginThunk
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload.name;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Обработка loadUserDataThunk
      .addCase(loadUserDataThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadUserDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload === null) {
          state.isAuthenticated = false;
          state.name = undefined;
        } else {
          state.name = action.payload.name;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadUserDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      });
  }
});

// Селекторы с типом RootState
export const selectUserName = (state: RootState): string => {
  if (state.user.loading) return 'Загрузка...';
  if (state.user.error) return `Ошибка: ${state.user.error}`;
  if (state.user.name) return state.user.name.trim();
  if (!state.user.isAuthenticated) return 'Гость';
  return 'Пользователь';
};

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.user.isAuthenticated;

export const selectUserToken = (state: RootState): string | undefined =>
  state.user.token;

export const selectUserLoading = (state: RootState): boolean =>
  state.user.loading;

export const selectUserError = (state: RootState): string | undefined =>
  state.user.error;

// Экспорт редьюсера и экшенов
export default userSlice.reducer;
export const { logout } = userSlice.actions;
