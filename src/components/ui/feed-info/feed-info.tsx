import React, { FC, memo } from 'react';
import styles from './feed-info.module.css';

// Импорт всех необходимых типов
import { FeedInfoProps, HalfColumnProps, TColumnProps } from './type';

export const FeedInfoUI: FC<FeedInfoProps> = memo(
  ({ feed, readyOrders, pendingOrders }) => {
    const { total, totalToday } = feed;

    return (
      <section className={styles.feedInfo}>
        <div className={styles.columns}>
          <HalfColumn
            orders={readyOrders}
            title={'Готовы'}
            textColor={'blue'}
          />
          <HalfColumn orders={pendingOrders} title={'В работе'} />
        </div>
        <Column title={'Выполнено за все время'} content={total} />
        <Column title={'Выполнено за сегодня'} content={totalToday} />
      </section>
    );
  }
);

const HalfColumn: FC<HalfColumnProps> = ({ orders, title, textColor }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className={`pr-6 ${styles.column}`}>
        <h3 className={`text text_type_main-medium ${styles.title}`}>
          {title}:
        </h3>
        <p className={`pt-6 text text_type_main-default ${styles.empty}`}>
          Нет заказов
        </p>
      </div>
    );
  }

  return (
    <div className={`pr-6 ${styles.column}`}>
      <h3 className={`text text_type_main-medium ${styles.title}`}>{title}:</h3>
      <ul className={`pt-6 ${styles.list}`}>
        {orders.map((item, index) => (
          <li
            className={`text text_type_digits-default ${styles.list_item}`}
            style={{ color: textColor === 'blue' ? '#00cccc' : '#F2F2F3' }}
            key={`${title}-${item}-${index}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Column: FC<TColumnProps> = ({ title, content }) => (
  <div className={styles.column}>
    <h3 className={`pt-15 text text_type_main-medium ${styles.title}`}>
      {title}:
    </h3>
    <p className={`text text_type_digits-large ${styles.content}`}>{content}</p>
  </div>
);
