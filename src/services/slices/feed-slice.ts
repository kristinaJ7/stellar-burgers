import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder, TFeedsResponse } from '@utils-types';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchOrdersFeed = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('feed/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (error) {
    return rejectWithValue('Не удалось загрузить ленту заказов');
  }
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setTotalToday: (state, action: PayloadAction<number>) => {
      state.totalToday = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchOrdersFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  }
});

export const { setOrders, setTotal, setTotalToday, clearError } =
  feedSlice.actions;
export default feedSlice.reducer;

export const selectFeedOrders = (state: { feed: FeedState }) =>
  state.feed.orders;
export const selectFeedTotal = (state: { feed: FeedState }) => state.feed.total;
export const selectFeedTotalToday = (state: { feed: FeedState }) =>
  state.feed.totalToday;
export const selectFeedLoading = (state: { feed: FeedState }) =>
  state.feed.loading;
export const selectFeedError = (state: { feed: FeedState }) => state.feed.error;
