import { TOrder } from '@utils-types';
export interface OrdersListUIProps {
  orderByDate: TOrder[];
  /**
   * Обработчик клика по заказу
   * @param orderNumber - номер заказа, по которому кликнули
   */
  // onOrderClick?: (orderNumber: number) => void;

  onOrderClick: (order: TOrder) => void;
}
