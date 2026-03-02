import { useAppSelector, useAppDispatch } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients-slice';
import { createOrder } from '../../services/slices/order-slice'; // Импорт экшена создания заказа
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Для навигации

export const ConstructorPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Существующие селекторы
  const ingredients = useAppSelector(selectIngredients);
  const isIngredientsLoading = useAppSelector(
    (state) => state.ingredients.isLoading
  );
  const hasError = useAppSelector(
    (state): string | null => state.ingredients.error
  );

  // НОВЫЙ: Селектор авторизации
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // НОВЫЙ: Обработчик нажатия кнопки
  const handleOrderSubmit = () => {
    if (!isAuthenticated) {
      // Сохраняем текущий путь для возврата после логина
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Только если авторизован — отправляем заказ
    // Передаём массив _id ингредиентов
    const ingredientIds = ingredients.map((item) => item._id);
    dispatch(createOrder(ingredientIds));
  };

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

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className='text text_type_main-medium'>
        Ингредиенты пока не загружены
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

      {/* НОВАЯ: Кнопка оформления заказа */}
    </main>
  );
};
