import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';
import { TIngredient } from '../../utils/types';

// Состояние конструктора
interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TIngredient[];
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
    // Удаление ингредиента (упрощено)
    removeIngredient: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.ingredients.findIndex((item) => item._id === id);
      if (index !== -1) state.ingredients.splice(index, 1);
    },

    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    // Перемещение ингредиента (оптимизировано)
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

      // Перемещаем элемент
      const moved = state.ingredients[from];
      state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    }
  },
  // Обработка единого экшена addItem
  extraReducers: (builder) => {
    builder.addCase(addItem, (state, action) => {
      const item = action.payload;

      if (item.type === 'bun') {
        // Если булка — заменяем текущую
        state.bun = item;
      } else {
        // Иначе — добавляем в массив ингредиентов
        state.ingredients.push(item);
      }
    });
  }
});

// Экспорт экшенов (убрали addIngredient и setBun — их заменяет addItem)
export const { removeIngredient, clearConstructor, moveIngredient } =
  constructorSlice.actions;

// Селекторы (остаются без изменений)
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
