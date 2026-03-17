import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addItem } from '../../services/slices/constructor-slice';
import { v4 as uuidv4 } from 'uuid'; // Импорт uuid для генерации id
import { TConstructorIngredient } from '../../utils/types'; // Импорт типа с id

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    // Логирование текущего location для отладки
    console.log('BurgerIngredient: current location', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      key: location.key
    });

    // Логирование данных ингредиента
    console.log('BurgerIngredient: ingredient data', {
      name: ingredient.name,
      _id: ingredient._id,
      price: ingredient.price,
      type: ingredient.type
    });

    const handleAdd = () => {
      console.log('BurgerIngredient: add button clicked', ingredient.name);

      // Создаём новый объект с уникальным id
      const ingredientWithId: TConstructorIngredient = {
        ...ingredient,
        id: uuidv4() // Генерация уникального идентификатора
      };

      console.log('BurgerIngredient: sending to Redux with id', {
        original: ingredient,
        withId: ingredientWithId
      });

      dispatch(addItem(ingredientWithId));
    };

    // Формируем locationState согласно типу TBurgerIngredientUIProps
    const locationState = {
      background: location
    };

    // Логирование формируемого locationState
    console.log('BurgerIngredient: locationState being passed', {
      background: {
        pathname: locationState.background.pathname,
        search: locationState.background.search,
        hash: locationState.background.hash,
        state: locationState.background.state,
        key: locationState.background.key
      }
    });

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={locationState}
        handleAdd={handleAdd}
      />
    );
  }
);

export default BurgerIngredient;
