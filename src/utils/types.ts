export type TIngredient = {
  //Описывает ингредиент (булочки, начинки и т. д.):
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  //Расширяет TIngredient полем id — используется в конструкторе бургера
  id: string;
};

// Тип заказа Описывает заказ:
export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  //Модель пользователя:
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main'; //Перечисление (enum) режимов вкладок в UI (например, в конструкторе бургера):

// Ответ сервера при создании заказа:

export interface TNewOrderResponse {
  order: TOrder;
  name: string;
}
// Ответ при авторизации/регистрации:
export type TAuthResponse = {
  success: boolean;
  refreshToken: string;
  accessToken: string;
  user: TUser;
};
//Данные, которые отправляет клиент на сервер:
export type TLoginData = {
  email: string;
  password: string;
};
//Данные, которые отправляет клиент на сервер: — для регистрации (email, имя, пароль).
export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};
//Ответ сервера при запросе данных пользователя:
export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TFeedsResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export interface OrdersListProps {
  orders: TOrder[];
  onOrderClick?: (orderNumber: number) => void;
}
