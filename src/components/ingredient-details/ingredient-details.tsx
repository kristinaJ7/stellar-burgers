import { FC } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Для получения ID из URL и проверки контекста

import { useAppSelector } from '../../services/store';
import {
  selectIngredients,
  selectIsLoading,
  selectError
} from '../../services/slices/ingredients-slice'; // Селекторы из слайса
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

// Определяем интерфейс пропсов с опциональным isModal
interface IngredientDetailsProps {
  isModal?: boolean;
}

export const IngredientDetails: FC<IngredientDetailsProps> = ({
  isModal = false
}) => {
  // 1. Получаем ID ингредиента из URL (например, /ingredients/123)
  const { id } = useParams();
  const location = useLocation();

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

  // 5. Определяем режим отображения
  if (isModal) {
    // В режиме модального окна просто отдаём данные в UI‑компонент
    return <IngredientDetailsUI ingredientData={ingredientData} />;
  }

  // В режиме полной страницы добавляем шапку и заголовок
  return (
    <div className='ingredient-full-page'>
      <h1 className='ingredient-title'>
        Детали ингредиента: {ingredientData.name}
      </h1>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
