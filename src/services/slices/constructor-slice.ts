import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

// Состояние конструктора
interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента с унификацией ID
    addItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      const item = action.payload;
      if (item.type === 'bun') {
        state.bun = item;
      } else {
        const normalizedItem = {
          ...item,
          id: item.id || item._id,
          _id: item._id || item.id
        };
        state.ingredients.push(normalizedItem);
      }
    },

    // Удаление ингредиента по _id (удаляет только один элемент)
    removeIngredient: (state, action: PayloadAction<string>) => {
      const ingredientId = action.payload;

      console.log(
        'constructorSlice: удаление ингредиента с _id:',
        ingredientId
      );
      console.log('constructorSlice: до удаления:', state.ingredients);

      // Находим индекс первого ингредиента с нужным _id
      const indexToRemove = state.ingredients.findIndex(
        (item) => item._id === ingredientId
      );

      // Если ингредиент найден, удаляем его (только один)
      if (indexToRemove !== -1) {
        state.ingredients.splice(indexToRemove, 1);
      }

      console.log('constructorSlice: после удаления:', state.ingredients);
    },

    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    // Перемещение ингредиента
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;

      // Валидация индексов
      if (
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      ) {
        return;
      }

      // Безопасное перемещение через копию массива
      const newIngredients = [...state.ingredients];
      const moved = newIngredients.splice(from, 1)[0];
      newIngredients.splice(to, 0, moved);
      state.ingredients = newIngredients;
    }
  }
});

// Экспорт экшенов
export const { addItem, removeIngredient, clearConstructor, moveIngredient } =
  constructorSlice.actions;

// Селекторы
export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor?.bun || null;

export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor?.ingredients || [];

export const selectConstructorData = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients,
    price:
      (bun?.price ?? 0) * 2 +
      ingredients.reduce((sum, item) => sum + (item.price ?? 0), 0)
  })
);

// Объединённый экспорт селекторов
export const constructorSelectors = {
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorData
};

export const constructorReducer = constructorSlice.reducer;
export default constructorSlice.reducer;
