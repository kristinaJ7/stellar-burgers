import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/services/root-reducer';
import { fetchUserOrders } from '../../services/slices/order-slice';
import { useAppDispatch } from '../../services/store';
import { Modal } from '@components';
import { OrderInfo } from '@components';
// Импортируем Preloader — замените на актуальный путь, если нужно
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  // Получаем заказы из стора
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.order.userOrders
  );

  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(false);
  // Состояния для модального окна
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = useCallback((order: TOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true); // открываем модалку при клике
    console.log('Order clicked in ProfileOrders:', order);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null); // сбрасываем выбранный заказ
  }, []);

  // Загружаем заказы при монтировании
  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchUserOrders())
      .unwrap()
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error('Ошибка загрузки заказов:', err);
        setIsLoading(false);
      });
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <ProfileOrdersUI orders={orders} onOrderClick={handleOrderClick} />

      {/* Модальное окно */}
      <Modal
        isOpen={isModalOpen}
        title={`Заказ №${selectedOrder?.number}`}
        onClose={closeModal}
      >
        {selectedOrder && <OrderInfo orderNumber={selectedOrder.number} />}
      </Modal>
    </>
  );
};
