import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { TIngredient, TConstructorIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid'; // Импорт uuid

// Состояние конструктора
interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[]; // Обновлённый тип
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

// Экшен для перемещения ингредиента
interface MoveIngredientPayload {
  from: number;
  to: number;
}

// Единый экшен для добавления любого ингредиента
export const addItem = createAction<TIngredient>('constructor/addItem');

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Удаление ингредиента по уникальному id
    removeIngredient: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.ingredients.findIndex((item) => item.id === id);
      if (index !== -1) state.ingredients.splice(index, 1);
    },

    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    // Перемещение ингредиента без мутаций
    moveIngredient: (state, action: PayloadAction<MoveIngredientPayload>) => {
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
  },
  // Обработка единого экшена addItem с генерацией id
  extraReducers: (builder) => {
    builder.addCase(addItem, (state, action) => {
      const item = action.payload;

      if (item.type === 'bun') {
        state.bun = item;
      } else {
        const constructorIngredient: TConstructorIngredient = {
          ...item,
          id: uuidv4()
        };
        state.ingredients.push(constructorIngredient);
      }
    });
  }
});

// Экспорт экшенов
export const { removeIngredient, clearConstructor, moveIngredient } =
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
