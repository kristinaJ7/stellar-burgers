import { RefObject } from 'react';
import { TIngredient, TTabMode } from '@utils-types';
export interface BurgerIngredientsUIProps {
  currentTab: TTabMode;
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  titleBunRef: React.RefObject<HTMLHeadingElement>;
  titleMainRef: React.RefObject<HTMLHeadingElement>;
  titleSaucesRef: React.RefObject<HTMLHeadingElement>;
  bunsRef: (node: HTMLElement | null) => void;
  mainsRef: (node: HTMLElement | null) => void;
  saucesRef: (node: HTMLElement | null) => void;
  onTabClick: (val: string) => void;
  // Новые пропсы для модального окна
  selectedIngredient: TIngredient | null;
  isModalOpen: boolean;
  onIngredientClick: (ingredient: TIngredient) => void;
  closeModal: () => void;
}
