/*import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
};
*/
import { TConstructorIngredient } from '@utils-types';
import { TIngredient } from '@utils-types';
export interface BurgerConstructorElementProps {
  ingredient: TIngredient;
  index: number;
  totalItems: number;

  onRemoveIngredient: (id: string) => void;
}
