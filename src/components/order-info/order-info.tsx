import { FC, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { Preloader } from '@ui';

import { OrderInfoUI } from '@ui';
import {
  selectModalOrderInfo,
  selectOrderRequest,
  selectOrderError,
  fetchOrderByNumber
} from '../../services/slices/order-slice';

export const OrderInfo: FC<{ orderNumber: number }> = ({ orderNumber }) => {
  const dispatch = useAppDispatch();
  const orderInfo = useAppSelector(selectModalOrderInfo);
  const loading = useAppSelector(selectOrderRequest);
  const error = useAppSelector(selectOrderError);

  useEffect(() => {
    if (typeof orderNumber === 'number' && orderNumber > 0) {
      console.log('OrderInfo: fetching order by number:', orderNumber);
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  // Отладочный вывод
  console.log('OrderInfo state:', {
    orderNumber,
    loading,
    error,
    hasOrderInfo: !!orderInfo
  });

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <div className='error-message'>
        <h4>Заказ №{orderNumber}</h4>
        <p>Данные заказа не загружены.</p>
        <button
          onClick={() => dispatch(fetchOrderByNumber(orderNumber))}
          className='retry-button'
        >
          Повторить загрузку
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-message'>
        <h4>Заказ №{orderNumber}</h4>
        <p>Ошибка загрузки: {error}</p>
        <button
          onClick={() => dispatch(fetchOrderByNumber(orderNumber))}
          className='retry-button'
        >
          Повторить загрузку
        </button>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
