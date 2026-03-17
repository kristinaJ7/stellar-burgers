import { FC, useMemo, useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/slices/constructor-slice';
import {
  selectOrderRequest,
  selectOrderModalData
} from '../../services/slices/order-slice';
import { createOrder, clearOrder } from '../../services/slices/order-slice';
import { clearConstructor } from '../../services/slices/constructor-slice';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectAuthChecked
} from '../../services/slices/auth-slice';
import { removeIngredient } from '../../services/slices/constructor-slice';

interface ApiError {
  status?: number;
  message?: string;
}

import { TIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun: TIngredient | null = useAppSelector(selectConstructorBun);
  const ingredients: TIngredient[] | null | undefined = useAppSelector(
    selectConstructorIngredients
  );
  const orderRequest = useAppSelector(selectOrderRequest);
  const orderModalData = useAppSelector(selectOrderModalData);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authChecked = useAppSelector(selectAuthChecked);

  const [errorText, setErrorText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Безопасное получение ингредиентов (оставляем для расчёта цены)
  const validIngredients = useMemo(() => {
    if (!ingredients || !Array.isArray(ingredients)) return [];
    return ingredients.filter((item) => item && item._id);
  }, [ingredients]);

  // Флаг для отображения модального окна
  const showOrderModal = !!orderModalData && !orderRequest;

  // Убираем проверку hasRequiredIngredients — теперь можно без начинок
  const isButtonDisabled = useMemo(
    () => orderRequest || !authChecked || !!errorText || !bun || !bun._id,
    [orderRequest, authChecked, errorText, bun]
  );

  // Отслеживаем загрузку данных булочки
  useEffect(() => {
    if (bun !== undefined) {
      setIsLoading(false);
    }
  }, [bun]);

  useEffect(() => {
    console.log('BurgerConstructor: authChecked =', authChecked);
    console.log('BurgerConstructor: isAuthenticated =', isAuthenticated);
    if (authChecked) setErrorText('');
  }, [isAuthenticated, authChecked]);

  const price = useMemo(() => {
    if (!bun) return 0;

    const bunPrice = bun.price ?? 0;
    const ingredientsPrice = validIngredients.reduce(
      (sum, item) => sum + (item.price ?? 0),
      0
    );
    const totalPrice = bunPrice * 2 + ingredientsPrice;
    console.log('BurgerConstructor: расчёт цены:', {
      bunPrice,
      ingredientsPrice,
      totalPrice
    });
    return totalPrice;
  }, [bun, validIngredients]);

  const ingredientIds = useMemo(() => {
    if (!bun || !bun._id) {
      return [];
    }

    // Теперь допустимо, если validIngredients пуст — будет только bun._id дважды
    const ids = [
      bun._id,
      ...validIngredients.map((ing) => ing._id).filter(Boolean),
      bun._id
    ];

    console.log('BurgerConstructor: сформированный массив ingredientIds:', ids);
    return ids;
  }, [bun, validIngredients]);

  const handleOrderClick = useCallback(async () => {
    console.group('=== НАЧАЛО ОТПРАВКИ ЗАКАЗА ===');
    console.log('onOrderClick: начало выполнения');

    setErrorText(''); // Сбрасываем предыдущие ошибки

    if (!authChecked) {
      setErrorText('Проверка авторизации...');
      console.warn(
        'Проверка авторизации ещё не завершена — прерывание отправки заказа'
      );
      console.groupEnd();
      return;
    }

    if (!isAuthenticated) {
      console.warn('Пользователь не авторизован, перенаправление на /login');
      navigate('/login', {
        state: { from: location.pathname },
        replace: true
      });
      console.groupEnd();
      return;
    }

    if (orderRequest) {
      setErrorText('Заказ уже обрабатывается');
      console.warn(
        'Заказ уже в процессе обработки — прерывание повторной отправки'
      );
      console.groupEnd();
      return;
    }

    if (ingredientIds.length === 0) {
      setErrorText('Не удалось сформировать список ингредиентов для заказа');
      console.error(
        'Сформированный ingredientIds пуст — невозможно отправить заказ'
      );
      console.groupEnd();
      return;
    }

    console.log('Готовность к отправке заказа: все проверки пройдены');
    console.log('Отправляем заказ с ingredientIds:', ingredientIds);

    try {
      await dispatch(createOrder(ingredientIds)).unwrap();
      console.log('Заказ успешно создан, очищаем конструктор');
      dispatch(clearConstructor());
    } catch (rawError) {
      console.error('=== ОШИБКА ПРИ ОТПРАВКЕ ЗАКАЗА ===');
      console.error('Полный объект ошибки:', rawError);

      const error = rawError as ApiError;

      if (error.status === 401) {
        console.warn('Ошибка 401: перенаправление на /login');
        setErrorText('Требуется авторизация');
        navigate('/login', {
          state: { from: location.pathname },
          replace: true
        });
      } else if (error.message) {
        setErrorText(error.message);
        alert(error.message);
        console.error('Ошибка API:', error.message);
      } else {
        setErrorText(
          'Не удалось оформить заказ. Проверьте подключение к интернету.'
        );
        alert('Не удалось оформить заказ. Проверьте подключение к интернету.');
        console.error('Неизвестная ошибка при отправке заказа');
      }
      dispatch(clearOrder());
    } finally {
      console.groupEnd(); // Закрываем группу логирования
    }
  }, [
    authChecked,
    isAuthenticated,
    bun,
    orderRequest,
    ingredientIds,
    dispatch,
    navigate,
    location.pathname
  ]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrder());
    setErrorText('');
    console.log('BurgerConstructor: модальное окно заказа закрыто');
  }, [dispatch]);

  // ДОБАВЛЕННЫЙ ОБРАБОТЧИК УДАЛЕНИЯ ИНГРЕДИЕНТА
  const handleRemoveIngredient = useCallback(
    (ingredientId: string) => {
      console.log(
        'BurgerConstructor: удаление ингредиента с _id:',
        ingredientId
      );
      dispatch(removeIngredient(ingredientId));
    },
    [dispatch]
  );

  const constructorItems = {
    bun: bun || null,
    ingredients: validIngredients
  };

  console.log('BurgerConstructor: рендер с данными:', {
    price,
    orderRequest,
    constructorItems,
    orderModalData,
    errorText,
    isButtonDisabled,
    isLoading,
    showOrderModal
  });

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={closeOrderModal}
      showOrderModal={showOrderModal}
      onRemoveIngredient={handleRemoveIngredient} // Теперь переменная существует
    />
  );
};
