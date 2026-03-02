import { FC, useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import {
  fetchOrdersFeed,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError
} from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const loading = useAppSelector(selectFeedLoading);
  const error = useAppSelector(selectFeedError);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchOrdersFeed());
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(fetchOrdersFeed())
      .unwrap()
      .finally(() => setIsRefreshing(false));
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='feed-error'>
        <p>Ошибка загрузки ленты: {error}</p>
        <button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Обновление...' : 'Повторить'}
        </button>
      </div>
    );
  }

  return (
    <div className='feed-container'>
      <div className='feed-stats' />
      <FeedUI orders={orders} handleGetFeeds={handleRefresh} />
    </div>
  );
};
