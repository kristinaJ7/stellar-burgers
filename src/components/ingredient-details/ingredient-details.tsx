import { FC } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../services/store';
import {
  selectIngredients,
  selectIsLoading,
  selectError
} from '../../services/slices/ingredients-slice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

interface IngredientDetailsProps {
  isModal?: boolean;
}

export const IngredientDetails: FC<IngredientDetailsProps> = ({
  isModal = false
}) => {
  const { id } = useParams();
  const location = useLocation();

  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const ingredientData = ingredients.find((item) => item._id === id);

  // Логирование для отладки
  console.log('IngredientDetails: id', id);
  console.log('IngredientDetails: ingredients loaded', ingredients.length);
  console.log('IngredientDetails: found ingredient', ingredientData);
  console.log('IngredientDetails: isModal', isModal);
  console.log('IngredientDetails: location.state', location.state);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div className='error'>Ошибка: {error}</div>;
  }

  if (!id) {
    return <div>ID не указан в URL</div>;
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  // В режиме модального окна рендерим только UI‑компонент
  if (isModal) {
    return <IngredientDetailsUI ingredientData={ingredientData} />;
  }

  // В режиме полной страницы добавляем заголовок
  return (
    <div className='ingredient-full-page'>
      <h1 className='ingredient-title'>
        Детали ингредиента: {ingredientData.name}
      </h1>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
