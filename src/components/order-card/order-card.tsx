import { FC, memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useAppSelector } from '../../services/store';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps & { onClick?: () => void }> = memo(
  ({ order, onClick }) => {
    const location = useLocation();

    const ingredients: TIngredient[] = useAppSelector(
      (state) => state.ingredients.items
    );

    const orderInfo = useMemo(() => {
      if (!ingredients.length) return null;

      const ingredientsInfo = order.ingredients.reduce(
        (acc: TIngredient[], item: string) => {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) return [...acc, ingredient];
          return acc;
        },
        []
      );

      const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
      const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
      const remains =
        ingredientsInfo.length > maxIngredients
          ? ingredientsInfo.length - maxIngredients
          : 0;
      const date = new Date(order.createdAt);

      return {
        ...order,
        ingredientsInfo,
        ingredientsToShow,
        remains,
        total,
        date
      };
    }, [order, order.ingredients, ingredients]);

    if (!orderInfo) return null;

    return (
      <Link
        to={`/feed/${order.number}`}
        state={{ background: location, title: `Заказ №${order.number}` }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <OrderCardUI orderInfo={orderInfo} maxIngredients={maxIngredients} />
      </Link>
    );
  }
);
