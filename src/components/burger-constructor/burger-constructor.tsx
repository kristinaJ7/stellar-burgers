import { FC, useMemo } from 'react';
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

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();

  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const orderRequest = useAppSelector(selectOrderRequest);
  const orderModalData = useAppSelector(selectOrderModalData);

  const validIngredients = ingredients || [];

  // Расчёт цены
  const price = useMemo(() => {
    const bunPrice = bun?.price ?? 0;
    const ingredientsPrice = validIngredients.reduce(
      (sum, item) => sum + (item.price ?? 0),
      0
    );
    return bunPrice * 2 + ingredientsPrice;
  }, [bun, validIngredients]);

  // Сбор ID ингредиентов (булка дважды)
  const ingredientIds = useMemo(() => {
    if (!bun?._id) return [];
    return [
      bun._id,
      ...validIngredients.map((ing) => ing._id).filter((id) => id),
      bun._id // Вторая булка (низ)
    ];
  }, [bun, validIngredients]);

  const onOrderClick = async () => {
    if (!bun) {
      alert('Для оформления заказа необходима булочка');
      return;
    }
    if (validIngredients.length === 0) {
      alert('Добавьте хотя бы один ингредиент');
      return;
    }
    if (orderRequest) return;

    try {
      await dispatch(createOrder(ingredientIds)).unwrap();
      dispatch(clearConstructor());
    } catch {
      alert('Не удалось оформить заказ. Проверьте подключение к интернету.');
      dispatch(clearOrder());
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const constructorItems = {
    bun: bun || null,
    ingredients: validIngredients
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
