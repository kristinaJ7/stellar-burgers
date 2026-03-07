import { TOrder } from '@utils-types';
import { TIngredient } from '@utils-types';
export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  showOrderModal: boolean;
};
