import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  selectCurrentOrder,
  selectOrderRequest,
  selectOrderError,
  fetchOrderByNumber
} from '../../services/slices/order-slice';
import { selectIngredients } from '../../services/slices/ingredients-slice';

export const OrderInfo: FC<{ orderNumber?: number }> = ({ orderNumber }) => {
  const dispatch = useAppDispatch();
  const orderData = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector(selectIngredients);
  const orderLoading = useAppSelector(selectOrderRequest);
  const error = useAppSelector(selectOrderError);

  useEffect(() => {
    if (
      typeof orderNumber === 'number' &&
      orderNumber > 0 &&
      (!orderData || orderData.number !== orderNumber)
    ) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, orderData]);

  const orderInfo = useMemo(() => {
    if (
      !orderData ||
      !Array.isArray(orderData.ingredients) ||
      !ingredients?.length
    ) {
      return null;
    }

    const date = new Date(orderData.createdAt ?? Date.now());
    const ingredientsInfo: { [key: string]: TIngredient & { count: number } } =
      {};
    const missingIngredients: string[] = [];

    orderData.ingredients.forEach((item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) {
        ingredientsInfo[item] = ingredientsInfo[item]
          ? { ...ingredient, count: ingredientsInfo[item].count + 1 }
          : { ...ingredient, count: 1 };
      } else {
        missingIngredients.push(item);
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      name: orderData.name ?? 'Без названия',
      status: orderData.status ?? 'unknown',
      ingredientsInfo,
      date,
      total,
      missingIngredients
    };
  }, [orderData, ingredients]);

  if (typeof orderNumber !== 'number' || orderNumber <= 0) {
    return (
      <div className='error-message'>
        Некорректный номер заказа: {orderNumber}. Проверьте передачу пропса.
      </div>
    );
  }

  if (orderLoading || !ingredients?.length) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='error-message'>
        Ошибка загрузки: {error}. Попробуйте обновить страницу.
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div className='error-message'>
        Не удалось загрузить данные заказа. Попробуйте позже.
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
