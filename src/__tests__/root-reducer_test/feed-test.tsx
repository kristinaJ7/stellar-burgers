import {
  feedSlice,
  fetchOrdersFeed,
  setOrders,
  selectFeedOrders,
  selectFeedLoading
} from '../../../src/services/slices/feed-slice';
import type { TOrder } from '@utils-types';
import { rootReducer } from '../../services/root-reducer';
import type { RootState } from 'src/services/root-reducer';

// Импортируем типы состояний из соответствующих слайсов
import type { AuthState } from '@slices/auth-slice';
import type { ConstructorState } from '../../services/slices/constructor-slice';
import type { IngredientsState } from '@slices/ingredients-slice';
import type { OrderState } from '@slices/order-slice';
import type { FeedState } from '../../../src/services/slices/feed-slice';
const mockIngredientsState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};
jest.mock('../../../src/utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

// Заглушки для типов состояний (используем реальные типы)
const mockAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  authChecked: false
};

const mockConstructorState: ConstructorState = {
  bun: null,
  ingredients: []
};

const mockOrderState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  orderNumber: null,
  currentOrder: null,
  ordersFeed: null,
  userOrders: [],
  error: null
};

// Mock‑данные
const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    name: 'Бургер с беконом',
    status: 'done',
    createdAt: '2023-01-01T12:00:00.000Z',
    updatedAt: '2023-01-01T12:05:00.000Z',
    number: 123,
    ingredients: ['1', '2']
  }
];

describe('feedSlice', () => {
  const initialState = feedSlice.getInitialState();

  // Проверка начального состояния
  it('should return initial state', () => {
    expect(feedSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  // Тест редьюсера setOrders
  it('setOrders updates orders correctly', () => {
    const result = feedSlice.reducer(initialState, setOrders(mockOrders));
    expect(result.orders).toEqual(mockOrders);
  });

  // Тест асинхронного экшена fetchOrdersFeed
  describe('fetchOrdersFeed', () => {
    const getFeedsApi = require('../../../src/utils/burger-api').getFeedsApi;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('sets loading to true on pending', () => {
      const action = { type: fetchOrdersFeed.pending.type };
      const result = feedSlice.reducer(initialState, action);
      expect(result.loading).toBe(true);
    });

    it('stores orders and sets loading to false on fulfilled', async () => {
      getFeedsApi.mockResolvedValue({ success: true, orders: mockOrders });
      const action = {
        type: fetchOrdersFeed.fulfilled.type,
        payload: { success: true, orders: mockOrders }
      };
      const result = feedSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(result.orders).toEqual(mockOrders);
      expect(result.loading).toBe(false);
    });
  });

  // Тесты селекторов
  describe('selectors', () => {
    // Полное состояние с корректными заглушками
    const fullState: RootState = {
      auth: mockAuthState,
      burgerConstructor: mockConstructorState,
      feed: { ...initialState, orders: mockOrders, loading: false },
      ingredients: mockIngredientsState,
      order: mockOrderState
    };

    // Состояние с пустым feed, но с корректными остальными состояниями
    const emptyFeedState: RootState = {
      auth: mockAuthState,
      burgerConstructor: mockConstructorState,
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      ingredients: mockIngredientsState,
      order: mockOrderState
    };

    it('selectFeedOrders returns orders from state', () => {
      expect(selectFeedOrders(fullState)).toEqual(mockOrders);
    });

    it('selectFeedOrders returns empty array when feed is empty', () => {
      expect(selectFeedOrders(emptyFeedState)).toEqual([]);
    });

    it('selectFeedLoading returns correct loading state', () => {
      expect(selectFeedLoading(fullState)).toBe(false);
    });
  });
});
