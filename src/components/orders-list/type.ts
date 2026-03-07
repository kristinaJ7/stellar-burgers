import { TOrder } from '@utils-types';

export interface OrdersListUIProps {
  orderByDate: TOrder[];

  //onOrderClick?: (orderNumber: number) => void;
  onOrderClick: (order: TOrder) => void;
}
