import React, { FC, memo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import { TProcessedOrderInfo } from 'src/services/slices/order-slice';
import styles from './order-info.module.css';
import { OrderStatus } from '@components';

export const OrderInfoUI: FC<{ orderInfo: TProcessedOrderInfo }> = memo(
  ({ orderInfo }) => {
    const {
      ingredientsInfo,
      date,
      total,
      name,
      status,
      missingIngredients,
      _id: orderId
    } = orderInfo;

    // Безопасное получение orderId: если нет — используем временную метку
    const safeOrderId = orderId || `temp-${Date.now()}`;

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
          {Object.entries(ingredientsInfo).map(([id, ingredient], index) => (
            <li
              className={`pb-4 pr-6 ${styles.item}`}
              key={`${id}-${safeOrderId}-${index}`} // уникальный ключ
            >
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
              {missingIngredients.map((id, index) => (
                <li
                  key={`${id}-${safeOrderId}-${index}`}
                  className={styles['missing-ingredient']}
                >
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
