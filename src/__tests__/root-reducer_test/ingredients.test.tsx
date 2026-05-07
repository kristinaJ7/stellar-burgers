import {
  ingredientsSlice,
  fetchIngredients,
  selectIngredients,
  selectIsLoading,
  selectError
} from '../../services/slices/ingredients-slice';

import type { RootState } from 'src/services/root-reducer';

import { mockIngredients } from '../../__mocks__/ingredients-mock';

describe('ingredientsSlice', () => {
  const initialState = ingredientsSlice.getInitialState();

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(ingredientsSlice.reducer(undefined, { type: '' })).toEqual(
        initialState
      );
    });

    it('should handle unknown action', () => {
      expect(
        ingredientsSlice.reducer(initialState, { type: 'UNKNOWN_ACTION' })
      ).toEqual(initialState);
    });
  });

  describe('fetchIngredients.pending', () => {
    it('sets isLoading to true and clears error', () => {
      const result = ingredientsSlice.reducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.items).toEqual([]);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('stores ingredients data and sets isLoading to false', async () => {
      // Настраиваем мок внутри теста
      jest.doMock('../../utils/burger-api', () => ({
        getIngredientsApi: jest.fn().mockResolvedValue(mockIngredients)
      }));

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const result = ingredientsSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(result.items).toEqual(mockIngredients);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('stores error and sets isLoading to false with payload', () => {
      jest.doMock('../../utils/burger-api', () => ({
        getIngredientsApi: jest.fn().mockRejectedValue('Network error')
      }));

      const mockError = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: mockError
      };
      const result = ingredientsSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(result.error).toBe(mockError);
      expect(result.isLoading).toBe(false);
      expect(result.items).toEqual([]);
    });

    it('uses default error message when payload is missing', () => {
      jest.doMock('../../utils/burger-api', () => ({
        getIngredientsApi: jest.fn().mockRejectedValue(undefined)
      }));

      const result = ingredientsSlice.reducer(
        { ...initialState, isLoading: true },
        { type: fetchIngredients.rejected.type }
      );
      expect(result.error).toBe('Произошла ошибка при загрузке ингредиентов');
      expect(result.isLoading).toBe(false);
    });
  });
});

describe('selectors', () => {
  const mockState: RootState = {
    auth: {
      user: null,
      isAuthenticated: false,
      error: null,
      authChecked: false
    },
    burgerConstructor: { bun: null, ingredients: [] },
    feed: { orders: [], total: 0, totalToday: 0, loading: false, error: null },
    ingredients: {
      items: mockIngredients,
      isLoading: false,
      error: null
    },
    order: {
      orderRequest: false,
      orderModalData: null,
      orderNumber: null,
      currentOrder: null,
      ordersFeed: null,
      userOrders: [],
      error: null
    }
  };

  it('selectIngredients returns ingredients items', () => {
    expect(selectIngredients(mockState)).toEqual(mockState.ingredients.items);
  });

  it('selectIsLoading returns isLoading state', () => {
    expect(selectIsLoading(mockState)).toBe(mockState.ingredients.isLoading);
  });

  it('selectError returns error state', () => {
    expect(selectError(mockState)).toBe(mockState.ingredients.error);
  });
});
