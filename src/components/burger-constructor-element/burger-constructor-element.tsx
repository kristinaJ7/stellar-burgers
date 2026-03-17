
import { FC, memo, useCallback } from 'react';
import { useAppDispatch } from '../../services/store';
import { moveIngredient } from '../../services/slices/constructor-slice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, onRemoveIngredient }) => {
    const dispatch = useAppDispatch();

    if (!ingredient) return null;

    const handleMoveDown = useCallback(() => {
      if (index + 1 < totalItems) {
        dispatch(moveIngredient({ from: index, to: index + 1 }));
      }
    }, [dispatch, index, totalItems]);

    const handleMoveUp = useCallback(() => {
      if (index - 1 >= 0) {
        dispatch(moveIngredient({ from: index, to: index - 1 }));
      }
    }, [dispatch, index]);

    // Исправлено: проверка существования id перед вызовом
    const handleClose = useCallback(() => {
      if (ingredient.id) {
        onRemoveIngredient(ingredient.id);
      } else {
        console.warn('Попытка удалить ингредиент без id:', ingredient);
      }
    }, [onRemoveIngredient, ingredient.id]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);

BurgerConstructorElement.displayName = 'BurgerConstructorElement';

