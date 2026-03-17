import { FC, useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import {
  fetchOrdersFeed,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError
} from '../../services/slices/feed-slice';
import { Modal } from '@components'; // предполагаемый импорт модалки
//import { OrderInfo } from './order-info'; // предполагаемый компонент деталей заказа
import { OrderInfo } from '@components';
export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const loading = useAppSelector(selectFeedLoading);
  const error = useAppSelector(selectFeedError);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // флаг видимости модалки

  useEffect(() => {
    dispatch(fetchOrdersFeed());
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(fetchOrdersFeed())
      .unwrap()
      .finally(() => setIsRefreshing(false));
  }, [dispatch]);

  const handleOrderClick = useCallback((order: TOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true); // открываем модалку при клике
    console.log('Order clicked:', order);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null); // сбрасываем выбранный заказ
  }, []);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='feed-error'>
        <p>Ошибка загрузки ленты: {error}</p>
        <button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Обновление...' : 'Повторить'}
        </button>
      </div>
    );
  }

  return (
    <div className='feed-container'>
      <div className='feed-stats' />
      <FeedUI
        orders={orders}
        handleGetFeeds={handleRefresh}
        onOrderClick={handleOrderClick}
      />

      {/* Модальное окно */}
      <Modal
        isOpen={isModalOpen}
        title={`Заказ №${selectedOrder?.number}`}
        onClose={closeModal}
      >
        {selectedOrder && <OrderInfo orderNumber={selectedOrder.number} />}
      </Modal>
    </div>
  );
};
