import { forwardRef, useMemo } from 'react';

import { useAppSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { selectConstructorData } from '../../services/slices/constructor-slice'; // ваш селектор

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Берём актуальное состояние из Redux
  const burgerConstructor = useAppSelector(selectConstructorData);

  if (!burgerConstructor) return null;

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};

    // Считаем ингредиенты в конструкторе
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Булка всегда учитывается дважды
    if (bun?._id) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [burgerConstructor, ingredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});

IngredientsCategory.displayName = 'IngredientsCategory';
