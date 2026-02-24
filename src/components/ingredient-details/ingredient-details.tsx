import { FC } from 'react';
import { useParams } from 'react-router-dom'; // Для получения ID из URL

import { useAppSelector } from '../../services/store';
import {
  selectIngredients,
  selectIsLoading,
  selectError
} from '../../services/slices/ingredients-slice'; // Селекторы из слайса
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  // 1. Получаем ID ингредиента из URL (например, /ingredients/123)
  const { id } = useParams();

  // 2. Достаём данные из Redux-стора
  const ingredients = useAppSelector(selectIngredients); // Список всех ингредиентов
  const isLoading = useAppSelector(selectIsLoading); // Флаг загрузки
  const error = useAppSelector(selectError); // Возможная ошибка

  // 3. Находим конкретный ингредиент по ID
  const ingredientData = ingredients.find((item) => item._id === id);

  // 4. Обрабатываем различные состояния
  if (isLoading) {
    return <Preloader />; // Показываем прелоадер во время загрузки
  }

  if (error) {
    return <div className='error'>Ошибка: {error}</div>; // Показываем ошибку
  }

  if (!id) {
    return <div>ID не указан в URL</div>; // Если ID отсутствует в адресе
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>; // Если ингредиент с таким ID не найден
  }

  // 5. Если всё ок — отдаём данные в UI-компонент
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
