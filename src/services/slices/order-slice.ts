import {
  createSlice,
  createAsyncThunk,
  ActionReducerMapBuilder,
  createSelector
} from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrderByNumberApi,
  getFeedsApi,
  getOrdersApi
} from '../../utils/burger-api';
import {
  TOrder,
  TOrdersData,
  TNewOrderResponse,
  TIngredient
} from '../../utils/types';
import { RootState } from '../root-reducer';
import { selectIngredients } from './ingredients-slice';

// Нормализация ответа заказа
const normalizeOrderResponse = (response: TNewOrderResponse): TOrder => ({
  ...response.order,
  name: response.name || response.order.name,
  status: response.order.status || 'created',
  createdAt: response.order.createdAt || new Date().toISOString(),
  updatedAt: response.order.updatedAt || new Date().toISOString()
});

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderNumber: number | null;
  currentOrder: TOrder | null;
  ordersFeed: TOrdersData | null;
  userOrders: TOrder[];
  error: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  orderNumber: null,
  currentOrder: null,
  ordersFeed: null,
  userOrders: [],
  error: null
};

// Асинхронные действия
export const createOrder = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    return await orderBurgerApi(ingredientIds);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ошибка оформления заказа';
    return rejectWithValue(message);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  } catch {
    return rejectWithValue('Заказ не найден');
  }
});

export const fetchOrdersFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('order/fetchOrdersFeed', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return {
      orders: response.orders,
      total: response.total,
      totalToday: response.totalToday
    };
  } catch {
    return rejectWithValue('Не удалось загрузить ленту заказов');
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch {
    return rejectWithValue('Не удалось загрузить историю заказов');
  }
});

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrdersFeed: (state) => {
      state.ordersFeed = null;
    },
    clearUserOrders: (state) => {
      state.userOrders = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOrder: () => ({ ...initialState }),
    resetOrderModal: (state) => {
      state.orderModalData = null;
      state.orderNumber = null;
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
        state.orderModalData = null;
        state.orderNumber = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = normalizeOrderResponse(action.payload);
        state.orderNumber = action.payload.order?.number || null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
        state.orderModalData = null;
        state.orderNumber = null;
      })

      // fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.orderNumber = action.payload.number;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка загрузки заказа';
      })

      // fetchOrdersFeed
      .addCase(fetchOrdersFeed.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrdersFeed.fulfilled, (state, action) => {
        state.ordersFeed = action.payload;
      })
      .addCase(fetchOrdersFeed.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка загрузки ленты заказов';
      })

      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка загрузки истории заказов';
      });
  }
});

export default orderSlice.reducer;

// Экспорт действий
export const {
  clearCurrentOrder,
  clearOrdersFeed,
  clearUserOrders,
  clearError,
  clearOrder,
  resetOrderModal
} = orderSlice.actions;

// Селекторы
export const selectOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderModalData;
export const selectCurrentOrder = (state: RootState): TOrder | null =>
  state.order.currentOrder;
export const selectOrdersFeed = (state: RootState): TOrdersData | null =>
  state.order.ordersFeed;
export const selectUserOrders = (state: RootState): TOrder[] =>
  state.order.userOrders;
export const selectOrderError = (state: RootState): string | null =>
  state.order.error;
export const selectOrderNumber = (state: RootState): number | null =>
  state.order.orderNumber;

// Новый селектор для обработанных данных заказа
export interface TProcessedOrderInfo extends TOrder {
  ingredientsInfo: { [key: string]: TIngredient & { count: number } };
  date: Date;
  total: number;
  missingIngredients: string[];
}

export const selectProcessedOrderInfo = createSelector(
  [selectCurrentOrder, selectIngredients],
  (order, ingredients): TProcessedOrderInfo | null => {
    if (!order || !Array.isArray(order.ingredients)) {
      return null;
    }

    const date = new Date(order.createdAt ?? Date.now());
    const ingredientsInfo: { [key: string]: TIngredient & { count: number } } =
      {};
    const missingIngredients: string[] = [];

    order.ingredients.forEach((ingredientId) => {
      const ingredient = ingredients.find((ing) => ing._id === ingredientId);
      if (ingredient) {
        ingredientsInfo[ingredientId] = ingredientsInfo[ingredientId]
          ? { ...ingredient, count: ingredientsInfo[ingredientId].count + 1 }
          : { ...ingredient, count: 1 };
      } else {
        missingIngredients.push(ingredientId);
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      name: order.name ?? 'Без названия',
      status: order.status ?? 'unknown',
      ingredientsInfo,
      date,
      total,
      missingIngredients
    };
  }
);
