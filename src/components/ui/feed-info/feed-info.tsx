import React, { FC, memo } from 'react';
import styles from './feed-info.module.css';
import { FeedInfoUIProps, HalfColumnProps, TColumnProps } from './type';

export const FeedInfoUI: FC<FeedInfoUIProps> = memo(
  ({ feed, readyOrders, pendingOrders }) => {
    // Безопасное извлечение значений с fallback‑значениями
    const total = feed?.total ?? 0;
    const totalToday = feed?.totalToday ?? 0;

    return (
      <section>
        <div className={styles.columns}>
          <HalfColumn
            orders={readyOrders}
            title={'Готовы'}
            textColor={'blue'}
          />
          <HalfColumn
            orders={pendingOrders}
            title={'В работе'}
            textColor={'gray'}
          />
        </div>
        <Column title={'Выполнено за все время'} content={total} />
        <Column title={'Выполнено за сегодня'} content={totalToday} />
      </section>
    );
  }
);

// Компонент HalfColumn
const HalfColumn: FC<HalfColumnProps> = ({
  orders,
  title,
  textColor = 'gray'
}) => (
  <div className={`pr-6 ${styles.column}`}>
    <h3 className={`text text_type_main-medium ${styles.title}`}>{title}:</h3>
    <ul className={`pt-6  ${styles.list}`}>
      {orders.length === 0 ? (
        <li className={styles.empty}>Нет заказов</li>
      ) : (
        orders.map((item) => (
          <li
            className={`text text_type_digits-default ${styles.list_item} ${textColor === 'blue' ? styles.ready : styles.pending}`}
            key={item.toString()}
          >
            {item}
          </li>
        ))
      )}
    </ul>
  </div>
);

// Компонент Column
const Column: FC<TColumnProps> = ({ title, content }) => (
  <>
    <h3 className={`pt-15 text text_type_main-medium ${styles.title}`}>
      {title}:
    </h3>
    <p className={`text text_type_digits-large ${styles.content}`}>{content}</p>
  </>
);
