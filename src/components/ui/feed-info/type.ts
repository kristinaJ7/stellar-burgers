export type FeedInfoUIProps = {
  feed: any;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};

export type FeedUIProps = {
  total: number;
  totalToday: number;
  readyOrders: number[];
  pendingOrders: number[];
  handleGetFeeds?: () => void;
};
