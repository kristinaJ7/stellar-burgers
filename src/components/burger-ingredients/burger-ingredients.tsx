import { useState, useRef, useEffect, FC, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useAppSelector } from '../../services/store';
import {
  selectIngredients,
  selectIsLoading
} from '../../services/slices/ingredients-slice';

export const BurgerIngredients: FC = () => {
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIsLoading);

  const buns = Array.isArray(ingredients)
    ? ingredients.filter((item) => item?.type === 'bun')
    : [];
  const mains = Array.isArray(ingredients)
    ? ingredients.filter((item) => item?.type === 'main')
    : [];
  const sauces = Array.isArray(ingredients)
    ? ingredients.filter((item) => item?.type === 'sauce')
    : [];

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0, triggerOnce: true });
  const [mainsRef, inViewFilling] = useInView({
    threshold: 0,
    triggerOnce: true
  });
  const [saucesRef, inViewSauces] = useInView({
    threshold: 0,
    triggerOnce: true
  });

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = useCallback(
    (val: string) => {
      let tab: TTabMode | undefined;

      switch (val) {
        case 'bun':
          tab = 'bun';
          break;
        case 'main':
          tab = 'main';
          break;
        case 'sauce':
          tab = 'sauce';
          break;
        default:
          return;
      }

      setCurrentTab(tab);

      const ref =
        tab === 'bun'
          ? titleBunRef
          : tab === 'main'
            ? titleMainRef
            : titleSaucesRef;

      if (ref.current instanceof HTMLElement) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },
    [setCurrentTab, titleBunRef, titleMainRef, titleSaucesRef]
  );

  if (isLoading) return <div>Загрузка ингредиентов...</div>;
  if (!ingredients || ingredients.length === 0)
    return <div>Нет ингредиентов</div>;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
