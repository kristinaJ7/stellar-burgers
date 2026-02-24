import { FC, useEffect } from 'react';
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

  useEffect(() => {
    dispatch(fetchOrdersFeed());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка загрузки ленты: {error}</div>;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchOrdersFeed())}
    />
  );
};
