import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { selectIngredients } from '../../services/slices/ingredients-slice';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useAppDispatch();

  // Загружаем ингредиенты при монтировании
  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const isIngredientsLoading = useAppSelector(
    (state) => state.ingredients.isLoading
  );
  const hasError = useAppSelector(
    (state): string | null => state.ingredients.error
  );
  const ingredients = useAppSelector(selectIngredients);

  // Логируем ингредиенты при их обновлении
  useEffect(() => {
    if (!isIngredientsLoading && !hasError && ingredients.length > 0) {
      console.log('Полученные ингредиенты:', ingredients);
    }
  }, [ingredients, isIngredientsLoading, hasError]);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return (
      <div className='text text_type_main-medium'>
        Ошибка загрузки ингредиентов: {hasError || 'Неизвестная ошибка'}
      </div>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
