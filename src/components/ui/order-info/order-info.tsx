import React, { FC, memo, useMemo, useEffect } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';
import { Preloader } from '../preloader';
import { TIngredient } from '@utils-types';
import styles from './order-info.module.css';
import { fetchOrderByNumber } from '../../../services/slices/order-slice';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import {
  selectCurrentOrder,
  selectOrderRequest,
  selectOrderError
} from '../../../services/slices/order-slice';
import { selectIngredients } from '../../../services/slices/ingredients-slice';
import { OrderStatus } from '@components';

type TOrderInfo = {
  ingredientsInfo: { [key: string]: TIngredient & { count: number } };
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
  missingIngredients: string[];
};

export const OrderInfoUI: FC<{ orderInfo: TOrderInfo }> = memo(
  ({ orderInfo }) => {
    const { ingredientsInfo, date, total, name, status, missingIngredients } =
      orderInfo;

    return (
      <div className={styles.wrap}>
        <h3
          className={`text text_type_main-medium pb-3 pt-10 ${styles.header}`}
        >
          {name}
        </h3>
        <OrderStatus status={status} />
        <p className='text text_type_main-medium pt-15 pb-6'>Состав:</p>
        <ul className={`${styles.list} mb-8`}>
          {Object.entries(ingredientsInfo).map(([id, ingredient]) => (
            <li className={`pb-4 pr-6 ${styles.item}`} key={id}>
              <div className={styles.img_wrap}>
                <div className={styles.border}>
                  <img
                    className={styles.img}
                    src={ingredient.image_mobile || ingredient.image}
                    alt={ingredient.name}
                  />
                </div>
              </div>
              <span className='text text_type_main-default pl-4'>
                {ingredient.name}
              </span>
              <span
                className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
              >
                {ingredient.count} x {ingredient.price}
              </span>
              <CurrencyIcon type='primary' />
            </li>
          ))}
        </ul>

        {missingIngredients.length > 0 && (
          <div className={styles['missing-ingredients']}>
            <p className='text text_type_main-medium'>
              <strong>Не найдены ингредиенты:</strong>
            </p>
            <ul className={styles.list}>
              {missingIngredients.map((id) => (
                <li key={id} className={styles['missing-ingredient']}>
                  {id}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.bottom}>
          <p className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={date} />
          </p>
          <span
            className={`text text_type_digits-default pr-4 ${styles.total}`}
          >
            {total}
          </span>
          <CurrencyIcon type='primary' />
        </div>
      </div>
    );
  }
);

export const OrderInfo: FC<{ orderNumber: number }> = ({ orderNumber }) => {
  const dispatch = useAppDispatch();
  const orderData = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector(selectIngredients) as TIngredient[];
  const orderLoading = useAppSelector(selectOrderRequest);
  const error = useAppSelector(selectOrderError);

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

  useEffect(() => {
    if (
      typeof orderNumber === 'number' &&
      orderNumber > 0 &&
      (!orderData || orderData.number !== orderNumber)
    ) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, orderData]);

  if (typeof orderNumber !== 'number' || orderNumber <= 0) {
    return (
      <div className={styles['error-message']}>
        Некорректный номер заказа: {orderNumber}. Проверьте передачу пропса.
      </div>
    );
  }

  if (orderLoading || !ingredients?.length) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className={styles['error-message']}>
        Ошибка загрузки: {error}. Попробуйте обновить страницу.
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div className={styles['error-message']}>
        Не удалось загрузить данные заказа. Попробуйте позже.
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
