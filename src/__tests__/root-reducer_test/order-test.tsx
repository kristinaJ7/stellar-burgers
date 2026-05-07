import {
  orderSlice,
  createOrder,
  fetchOrderByNumber,
  selectOrderRequest,
  selectOrderModalData,
  selectOrderError
} from '../../services/slices/order-slice';
import type { RootState } from 'src/services/root-reducer';
import type { TOrder, TNewOrderResponse } from '../../utils/types';

// Моковые данные
const mockOrder: TOrder = {
  _id: 'order-123',
  name: 'Вкусный бургер',
  status: 'done',
  number: 12345,
  createdAt: '2023-10-10T10:00:00.000Z',
  updatedAt: '2023-10-10T10:05:00.000Z',
  ingredients: ['643d69a5c3f7b9001cfa093e']
};
const mockNewOrderResponse: TNewOrderResponse = {
  order: mockOrder,
  name: 'Вкусный бургер'
};

describe('orderSlice', () => {
  const initialState = orderSlice.getInitialState();

  describe('reducers', () => {
    it('clearCurrentOrder sets currentOrder to null', () => {
      const state = { ...initialState, currentOrder: mockOrder };
      const result = orderSlice.reducer(
        state,
        orderSlice.actions.clearCurrentOrder()
      );
      expect(result.currentOrder).toBeNull();
    });

    it('resetOrderState resets to initial state', () => {
      const modifiedState = {
        ...initialState,
        orderRequest: true,
        error: 'error'
      };
      const result = orderSlice.reducer(
        modifiedState,
        orderSlice.actions.resetOrderState()
      );
      expect(result).toEqual(initialState);
    });
  });

  describe('createOrder', () => {
    it('pending sets orderRequest to true', () => {
      const result = orderSlice.reducer(
        initialState,
        createOrder.pending('', [])
      );
      expect(result.orderRequest).toBe(true);
    });

    it('fulfilled stores order data', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockNewOrderResponse
      };
      const result = orderSlice.reducer(
        { ...initialState, orderRequest: true },
        action
      );
      expect(result.orderModalData).toEqual(mockOrder);
      expect(result.orderNumber).toBe(mockOrder.number);
      expect(result.orderRequest).toBe(false);
    });

    it('rejected stores error', () => {
      const action = { type: createOrder.rejected.type, payload: 'Ошибка' };
      const result = orderSlice.reducer(
        { ...initialState, orderRequest: true },
        action
      );
      expect(result.error).toBe('Ошибка');
      expect(result.orderRequest).toBe(false);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('fulfilled stores order in orderModalData', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const result = orderSlice.reducer(initialState, action);
      expect(result.orderModalData).toEqual(mockOrder);
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
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      ingredients: { items: [], isLoading: false, error: null },
      order: { ...initialState, orderModalData: mockOrder }
    };

    it('selectOrderRequest returns orderRequest state', () => {
      expect(selectOrderRequest(mockState)).toBe(false);
    });

    it('selectOrderModalData returns orderModalData', () => {
      expect(selectOrderModalData(mockState)).toEqual(mockOrder);
    });

    it('selectOrderError returns error state', () => {
      expect(selectOrderError(mockState)).toBeNull();
    });
  });
});
