import rootReducer, { RootState } from '../../../src/services/root-reducer';

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

describe('rootReducer', () => {
  describe('initialization', () => {
    it('should return the complete initial state when called with undefined state and any action', () => {
      const initialState: RootState = rootReducer(undefined, { type: '' }); // исправлено: type: ''
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

    it('should preserve existing state when called with partial state', () => {
      const partialState: Partial<RootState> = {
        auth: { ...mockAuthState, isAuthenticated: true }
      };
      const result = rootReducer(partialState as RootState, {
        type: 'SOME_ACTION'
      });
      expect(result.auth.isAuthenticated).toBe(true);
    });
  });

  describe('type safety', () => {
    it('RootState type should match the actual reducer output', () => {
      const state: RootState = rootReducer(undefined, { type: '' });
      expect(state).toBeDefined();
    });
  });
});
