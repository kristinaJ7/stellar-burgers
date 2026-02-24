import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../root-reducer';
import {
  TUser,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse
} from '@utils-types';
import * as api from '../../utils/burger-api';
import { getCookie } from '../../utils/cookie';

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=3600`;
};

type AuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null
};

// Асинхронные действия
export const login = createAsyncThunk<
  TAuthResponse,
  TLoginData,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await api.loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response;
  } catch {
    return rejectWithValue('Неверный email или пароль');
  }
});

export const register = createAsyncThunk<
  TAuthResponse,
  TRegisterData,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await api.registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response;
  } catch {
    return rejectWithValue('Ошибка регистрации');
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.logoutApi();
      dispatch(clearUser());
      localStorage.removeItem('refreshToken');
      setCookie('accessToken', '');
    } catch {
      return rejectWithValue('Ошибка выхода');
    }
  }
);

export const checkAuth = createAsyncThunk<
  TUserResponse,
  void,
  { rejectValue: string }
>('auth/checkAuth', async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  if (!state.auth.isAuthenticated) {
    return rejectWithValue('Пользователь не авторизован');
  }

  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('Токен отсутствует');
    }

    const response = await api.getUserApi();
    return response;
  } catch (err) {
    if (err instanceof Error && err.message === 'jwt expired') {
      try {
        const refreshData = await api.refreshToken();
        setCookie('accessToken', refreshData.accessToken);
        localStorage.setItem('refreshToken', refreshData.refreshToken);
        const response = await api.getUserApi();
        return response;
      } catch {
        return rejectWithValue('Сессия истекла');
      }
    }
    return rejectWithValue('Ошибка проверки авторизации');
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка входа';
      })

      // register
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка регистрации';
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка выхода';
      })

      // checkAuth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка проверки авторизации';
        state.isAuthenticated = false;
      });
  }
});

export const { clearUser, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;

// Селекторы
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated || !!getCookie('accessToken');

export const selectUser = (state: RootState): TUser | null => state.auth.user;

export const selectAuthError = (state: RootState): string | null =>
  state.auth.error;
