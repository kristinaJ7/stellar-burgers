import { TOrder } from '@utils-types';

export type FeedInfoProps = {
  feed: {
    total: number;
    totalToday: number;
    orders?: TOrder[]; // опционально
    isLoading?: boolean; // опционально
    error?: string | null; // опционально
  };
  readyOrders: number[];
  pendingOrders: number[];
};

// Для HalfColumn (вспомогательный компонент FeedInfo)
export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: 'blue' | 'gray'; // ограничьте возможные значения
};

// Для Column (вспомогательный компонент FeedInfo)
export type TColumnProps = {
  title: string;
  content: number | string; // может быть строкой, например, «Нет данных»
};

// Для основного компонента FeedUI
export type FeedUIProps = {
  orders: TOrder[]; // массив заказов для отображения
  handleGetFeeds: () => void; // функция обновления ленты
  onOrderClick: (order: TOrder) => void; // обработчик клика по заказу
  feed: {
    total: number;
    totalToday: number;
  };
  readyOrders: number[];
  pendingOrders: number[];
};
