import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/services/root-reducer';
import { fetchUserOrders } from '../../services/slices/order-slice';
import { useAppDispatch } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  // Получаем заказы из стора
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.order.userOrders
  );

  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(false);

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

  return <ProfileOrdersUI orders={orders} />;
};
