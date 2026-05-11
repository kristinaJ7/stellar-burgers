//import { register } from 'module';
import { login, checkAuth } from '../../../src/services/slices/auth-slice';
import { authSlice } from '../../../src/services/slices/auth-slice';
import { logout } from '../../../src/services/slices/auth-slice';


import { register } from '../../../src/services/slices/auth-slice';
import type {
  TUser,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse
} from '@utils-types';

// Мокаем API-функции
jest.mock('../../utils/burger-api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  refreshToken: jest.fn()
}));

// Мокаем cookie-функции
jest.mock('../../utils/cookie', () => ({
  getCookie: jest.fn()
}));

describe('authSlice', () => {
  const initialState = authSlice.getInitialState();

  // Mock-данные
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockAuthResponse: TAuthResponse = {
    success: true,
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token'
  };

  const mockLoginData: TLoginData = {
    email: 'test@example.com',
    password: 'password'
  };

  const mockRegisterData: TRegisterData = {
    email: 'test@example.com',
    password: 'password',
    name: 'Test User'
  };

  const mockUserResponse: TUserResponse = {
    success: true,
    user: mockUser
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(authSlice.reducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should handle unknown action', () => {
      expect(
        authSlice.reducer(initialState, { type: 'UNKNOWN_ACTION' })
      ).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    describe('clearUser', () => {
      it('resets user, isAuthenticated and error', () => {
        const stateWithData = {
          ...initialState,
          user: mockUser,
          isAuthenticated: true,
          error: 'Some error'
        };

        const result = authSlice.reducer(
          stateWithData,
          authSlice.actions.clearUser()
        );

        expect(result.user).toBeNull();
        expect(result.isAuthenticated).toBe(false);
        expect(result.error).toBeNull();
      });
    });

    describe('setAuthenticated', () => {
      it('sets isAuthenticated to true', () => {
        const result = authSlice.reducer(
          initialState,
          authSlice.actions.setAuthenticated(true)
        );
        expect(result.isAuthenticated).toBe(true);
      });

      it('sets isAuthenticated to false', () => {
        const result = authSlice.reducer(
          initialState,
          authSlice.actions.setAuthenticated(false)
        );
        expect(result.isAuthenticated).toBe(false);
      });
    });
  });

  describe('login', () => {
    describe('pending', () => {
      it('sets authChecked to false', () => {
        const action = { type: login.pending.type };
        const result = authSlice.reducer(initialState, action);
        expect(result.authChecked).toBe(false);
      });
    });

    describe('fulfilled', () => {
      it('stores user data and sets auth flags', () => {
        const action = {
          type: login.fulfilled.type,
          payload: mockAuthResponse
        };
        const result = authSlice.reducer(initialState, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuthenticated).toBe(true);
        expect(result.error).toBeNull();
        expect(result.authChecked).toBe(true);
      });
    });

    describe('rejected', () => {
      it('stores error and sets authChecked to true', () => {
        const mockError = 'Неверный email или пароль';
        const action = {
          type: login.rejected.type,
          payload: mockError
        };
        const result = authSlice.reducer(initialState, action);

        expect(result.error).toBe(mockError);
        expect(result.authChecked).toBe(true);
        expect(result.isAuthenticated).toBe(false);
      });
    });
  });
describe('register', () => {
  describe('pending', () => {
    it('устанавливает authChecked в false', () => {
      const action = { type: register.pending.type };
      const result = authSlice.reducer(initialState, action);
      expect(result.authChecked).toBe(false);
    });
  });

  describe('fulfilled', () => {
    it('сохраняет данные пользователя и устанавливает флаги аутентификации', () => {
      const action = {
        type: register.fulfilled.type,
        payload: mockAuthResponse
      };
      const result = authSlice.reducer(initialState, action);

      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.error).toBeNull();
      expect(result.authChecked).toBe(true);
    });
  });

  describe('rejected', () => {
    it('сохраняет ошибку и сбрасывает флаги аутентификации', () => {
      const mockError = 'Ошибка регистрации';
      const action = {
        type: register.rejected.type,
        payload: mockError
      };
      const result = authSlice.reducer(initialState, action);

      expect(result.error).toBe(mockError);
      expect(result.isAuthenticated).toBe(false);
      expect(result.authChecked).toBe(true);
    });
  });
});

describe('logout', () => {
  describe('pending', () => {
    it('устанавливает authChecked в false', () => {
      const action = { type: logout.pending.type };
      const result = authSlice.reducer(initialState, action);
      expect(result.authChecked).toBe(false);
    });
  });

  describe('fulfilled', () => {
    it('очищает данные пользователя и сбрасывает флаги аутентификации', () => {
      const action = {
        type: logout.fulfilled.type
      };
      const result = authSlice.reducer(initialState, action);

      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.error).toBeNull();
      expect(result.authChecked).toBe(true);
    });
  });

  describe('rejected', () => {
    it('сохраняет ошибку, authChecked остаётся true', () => {
      const mockError = 'Ошибка выхода из системы';
      const action = {
        type: logout.rejected.type,
        payload: mockError
      };
      const result = authSlice.reducer(initialState, action);

      expect(result.error).toBe(mockError);
      expect(result.authChecked).toBe(true);
    });
  });
});
  describe('checkAuth', () => {
    describe('pending', () => {
      it('sets authChecked to false', () => {
        const action = { type: checkAuth.pending.type };
        const result = authSlice.reducer(initialState, action);
        expect(result.authChecked).toBe(false);
      });
    });

    describe('fulfilled', () => {
      it('stores user data and sets auth flags', () => {
        const action = {
          type: checkAuth.fulfilled.type,
          payload: mockUserResponse
        };
        const result = authSlice.reducer(initialState, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuthenticated).toBe(true);
        expect(result.error).toBeNull();
        expect(result.authChecked).toBe(true);
      });
    });

    describe('rejected', () => {
      it('stores error and resets auth flags', () => {
        const mockError = 'Ошибка проверки авторизации';
        const action = {
          type: checkAuth.rejected.type,
          payload: mockError
        };
        const result = authSlice.reducer(initialState, action);

        expect(result.error).toBe(mockError);
        expect(result.isAuthenticated).toBe(false);
        expect(result.authChecked).toBe(true);
      });
    });
  });
});
