import { useAppSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/slices/feed-slice';
import { FC, useMemo } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

interface FeedInfoProps {}

export const FeedInfo: FC<FeedInfoProps> = () => {
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);

  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);
  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);

  return (
    <FeedInfoUI
      feed={{ total, totalToday }}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};

const getOrders = (orders: TOrder[], status: string): number[] => {
  if (!orders || !Array.isArray(orders)) return [];
  return orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);
};
