/*import { TIngredient } from '@utils-types';

export type OrderInfoUIProps = {
  orderInfo: TOrderInfo;
   
};

type TOrderInfo = {
  ingredientsInfo: {
    [key: string]: TIngredient & { count: number };
  };
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};
*/

import { TIngredient } from '@utils-types';

// Пропсы для OrderInfo (компонент, который загружает данные)
export interface OrderInfoProps {
  //orderNumber: number;
  isModal?: boolean; // необязательное свойство

  orderNumber: number | null;
}

// Полный тип информации о заказе
export interface TOrderInfo {
  ingredientsInfo: {
    [key: string]: TIngredient & { count: number };
  };
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
  missingIngredients?: string[]; // опциональное поле
}

// Пропсы для OrderInfoUI (UI-компонент)
export type OrderInfoUIProps = {
  orderInfo: TOrderInfo;
  isModal: boolean;
};
