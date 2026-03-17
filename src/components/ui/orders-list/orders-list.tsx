import { FC } from 'react';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({
  orderByDate,
  onOrderClick
}) => {
  console.log(
    'Данные заказов:',
    orderByDate.map((o) => ({
      _id: o._id,
      ingredientIds: o.ingredients // массив _id ингредиентов из заказа
    }))
  );
  return (
    <div className={`${styles.content}`}>
      {orderByDate.map((order, index) => (
        <OrderCard
          order={order}
          key={`${order._id}-${index}`}
          onClick={() => onOrderClick?.(order)}
        />
      ))}
    </div>
  );
};
