import rootReducer, { RootState } from '../../../src/services/root-reducer';
import { constructorSlice } from '@slices/constructor-slice';
import { authSlice } from '../../../src/services/slices/auth-slice';
import { TConstructorIngredient } from '../../utils/types';

// Явно задаём начальные состояния — сверены с реальными initialState из слайсов
const mockAuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  authChecked: false
};

const mockConstructorState = {
  bun: null,
  ingredients: []
};

const mockFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const mockIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

const mockOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderNumber: null,
  currentOrder: null,
  ordersFeed: null,
  userOrders: [],
  error: null
};

// Фабрика для создания тестовых ингредиентов
const createTestIngredient = (
  id: string,
  name: string,
  type: string = 'main'
): TConstructorIngredient => ({
  id,
  _id: id,
  name,
  type,
  price: 100,
  calories: 200,
  carbohydrates: 10,
  fat: 5,
  proteins: 8,
  image: `/images/${id}.png`,
  image_large: `/images/large/${id}.png`,
  image_mobile: `/images/mobile/${id}.png`
});

describe('rootReducer', () => {
  describe('initialization', () => {
    it('should return the complete initial state when called with undefined state and any action', () => {
      const initialState: RootState = rootReducer(undefined, { type: '' });
      expect(initialState).toEqual({
        auth: mockAuthState,
        burgerConstructor: mockConstructorState,
        feed: mockFeedState,
        ingredients: mockIngredientsState,
        order: mockOrderState
      });
    });

    it('should handle unknown action and return current state', () => {
      const currentState: RootState = {
        auth: mockAuthState,
        burgerConstructor: mockConstructorState,
        feed: mockFeedState,
        ingredients: mockIngredientsState,
        order: mockOrderState
      };
      const result = rootReducer(currentState, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(currentState);
    });

    it('should properly update individual slices without affecting others', () => {
      const initialState: RootState = rootReducer(undefined, { type: '' });

      // Используем реальное действие из authSlice
      const setAuthenticatedAction = authSlice.actions.setAuthenticated(true);
      const result = rootReducer(initialState, setAuthenticatedAction);

      // Проверяем изменения в auth
      expect(result.auth.isAuthenticated).toBe(true);

      // Проверяем, что остальные слайсы остались неизменными
      expect(result.burgerConstructor).toEqual(mockConstructorState);
      expect(result.feed).toEqual(mockFeedState);
      expect(result.ingredients).toEqual(mockIngredientsState);
      expect(result.order).toEqual(mockOrderState);
    });
  });

  describe('state integrity', () => {
    it('should maintain correct structure and update multiple slices sequentially using real actions', () => {
      let state: RootState = rootReducer(undefined, { type: '' });

      // 1. Обновляем auth slice через реальное действие
      state = rootReducer(state, authSlice.actions.setAuthenticated(true));
      expect(state.auth.isAuthenticated).toBe(true);

      // 2. Обновляем burgerConstructor slice через реальное действие addItem
      const ingredientToAdd = createTestIngredient('456', 'Test Ingredient');

      state = rootReducer(state, constructorSlice.actions.addItem(ingredientToAdd));

      // Проверяем добавление ингредиента
      expect(state.burgerConstructor.ingredients.length).toBe(1);
      expect(state.burgerConstructor.ingredients[0]).toEqual(expect.objectContaining({
        id: '456',
        name: 'Test Ingredient'
      }));

      // Финальная проверка целостности состояния
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.burgerConstructor.ingredients.length).toBe(1);
    });
  });
});
