import { FC, memo } from 'react';
import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

export const FeedUI: FC<FeedUIProps> = memo(
  ({ orders, handleGetFeeds, onOrderClick }) => {
    const hasOrders = orders && orders.length > 0;

    return (
      <main className={styles.containerMain}>
        <div className={`${styles.titleBox} mt-10 mb-5`}>
          <h1 className={`${styles.title} text text_type_main-large`}>
            Лента заказов
          </h1>
          <RefreshButton
            text='Обновить'
            onClick={handleGetFeeds}
            extraClass={'ml-30'}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.columnOrders}>
            {hasOrders ? (
              <OrdersList orders={orders} onOrderClick={onOrderClick} />
            ) : (
              <div className={styles.emptyState}>
                <p className='text text_type_main-default'>Заказав пока нет</p>
              </div>
            )}
          </div>
          <div className={styles.columnInfo}>
            <FeedInfo /> {/* Пропсы убраны */}
          </div>
        </div>
      </main>
    );
  }
);
