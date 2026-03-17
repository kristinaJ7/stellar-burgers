import { TIngredient } from '@utils-types';
import { TConstructorIngredient } from '@utils-types';
export interface BurgerConstructorElementUIProps {
  ingredient: TIngredient;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
}
