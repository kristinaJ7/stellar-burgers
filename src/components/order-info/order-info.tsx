import React, { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  selectProcessedOrderInfo,
  selectOrderRequest,
  selectOrderError,
  fetchOrderByNumber
} from '../../services/slices/order-slice';

export const OrderInfo: FC<{ orderNumber: number }> = ({ orderNumber }) => {
  const dispatch = useAppDispatch();
  const orderInfo = useAppSelector(selectProcessedOrderInfo);
  const loading = useAppSelector(selectOrderRequest);
  const error = useAppSelector(selectOrderError);

  useEffect(() => {
    if (
      typeof orderNumber === 'number' &&
      orderNumber > 0 &&
      (!orderInfo || orderInfo.number !== orderNumber)
    ) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, orderInfo]);

  if (typeof orderNumber !== 'number' || orderNumber <= 0) {
    return (
      <div className='error-message'>
        Некорректный номер заказа: {orderNumber}. Проверьте передачу пропса.
      </div>
    );
  }

  if (loading) {
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
