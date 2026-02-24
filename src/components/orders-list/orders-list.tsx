import { FC, memo } from 'react';

import { OrdersListProps } from '@utils-types';
import { OrdersListUI } from '@ui';
import { OrdersListUIProps } from '../ui/orders-list/type';

export const OrdersList: FC<OrdersListProps> = memo(
  ({ orders, onOrderClick }) => {
    const orderByDate = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
      <OrdersListUI orderByDate={orderByDate} onOrderClick={onOrderClick} />
    );
  }
);
