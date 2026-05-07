import {
  constructorSlice,
  addItem,
  removeIngredient,
  clearConstructor,
  moveIngredient
} from '../../../src/services/slices/constructor-slice';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorData
} from '../../../src/services/slices/constructor-slice';
import type { TIngredient, TConstructorIngredient } from '../../utils/types';
import type { RootState } from 'src/services/root-reducer';

// Mock‑данные
const mockBun: TIngredient = {
  calories: 643,
  carbohydrates: 85,
  fat: 26,
  id: '08799d7b-031f-48b0-9a06-5608398efa40',
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  name: 'Флюоресцентная булка R2-D3',
  price: 988,
  proteins: 44,
  type: 'bun',
  _id: '643d69a5c3f7b9001cfa093d'
};

const mockIngredient1: TConstructorIngredient = {
  calories: 420,
  carbohydrates: 53,
  fat: 14,
  id: 'a4df36be-19c9-4301-8e23-3ec985198ae3',
  image: 'https://code.s3.yandex.net/react/code/main-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/main-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/main-01-mobile.png',
  name: 'Филе Люминесцентного тетраодонтимформа',
  price: 200,
  proteins: 44,
  type: 'main',
  _id: '643d69a5c3f7b9001cfa093e'
};

describe('constructorSlice', () => {
  const initialState = constructorSlice.getInitialState();

  // Проверка начального состояния
  it('should return the initial state', () => {
    expect(constructorSlice.reducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  describe('reducers', () => {
    describe('addItem', () => {
      it('adds bun and ingredient correctly', () => {
        const bunWithType = {
          ...mockBun,
          type: 'bun'
        } as TConstructorIngredient;
        let state = constructorSlice.reducer(
          initialState,
          addItem(bunWithType)
        );
        state = constructorSlice.reducer(state, addItem(mockIngredient1));

        expect(state.bun).toEqual(bunWithType);
        expect(state.ingredients).toHaveLength(1);
        expect(state.ingredients[0]._id).toBe(mockIngredient1._id);
      });
    });

    describe('removeIngredient', () => {
      it('removes ingredient by id correctly', () => {
        let state = constructorSlice.reducer(
          initialState,
          addItem(mockIngredient1)
        );
        const result = constructorSlice.reducer(
          state,
          removeIngredient(mockIngredient1.id)
        );
        expect(result.ingredients).toHaveLength(0);
      });
    });

    describe('clearConstructor', () => {
      it('clears all constructor data', () => {
        let state = constructorSlice.reducer(
          initialState,
          addItem({ ...mockBun, type: 'bun' } as TConstructorIngredient)
        );
        state = constructorSlice.reducer(state, addItem(mockIngredient1));
        const result = constructorSlice.reducer(state, clearConstructor());
        expect(result).toEqual(initialState);
      });
    });

    describe('moveIngredient', () => {
      it('moves ingredient within bounds', () => {
        let state = constructorSlice.reducer(
          initialState,
          addItem(mockIngredient1)
        );
        // Добавляем ещё один ингредиент для теста перемещения
        const mockIngredient2: TConstructorIngredient = {
          ...mockIngredient1,
          _id: 'new-id'
        };
        state = constructorSlice.reducer(state, addItem(mockIngredient2));

        const result = constructorSlice.reducer(
          state,
          moveIngredient({ from: 0, to: 1 })
        );
        expect(result.ingredients[0]._id).toBe(mockIngredient2._id);
        expect(result.ingredients[1]._id).toBe(mockIngredient1._id);
      });
    });
  });

  describe('selectors', () => {
    const mockRootState: RootState = {
      auth: {
        isAuthenticated: false,
        user: null,
        error: null,
        authChecked: false
      },
      burgerConstructor: { bun: mockBun, ingredients: [mockIngredient1] },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      ingredients: { items: [], isLoading: false, error: null },
      order: {
        currentOrder: null,
        orderNumber: null,
        error: null,
        orderRequest: false,
        orderModalData: null,
        ordersFeed: null,
        userOrders: []
      }
    };

    it('selectConstructorBun returns bun correctly', () => {
      expect(selectConstructorBun(mockRootState)).toEqual(mockBun);
    });

    it('selectConstructorIngredients returns ingredients array', () => {
      expect(selectConstructorIngredients(mockRootState)).toEqual([
        mockIngredient1
      ]);
    });

    it('selectConstructorData calculates correct price', () => {
      const data = selectConstructorData(mockRootState);
      expect(data.price).toBe(2176); // 988 * 2 + 200
      expect(data.bun).toEqual(mockBun);
      expect(data.ingredients).toEqual([mockIngredient1]);
    });

    it('selectConstructorData handles empty state', () => {
      const emptyState: RootState = {
        ...mockRootState,
        burgerConstructor: { bun: null, ingredients: [] }
      };
      const data = selectConstructorData(emptyState);
      expect(data.price).toBe(0);
      expect(data.bun).toBeNull();
      expect(data.ingredients).toHaveLength(0);
    });
  });
});
