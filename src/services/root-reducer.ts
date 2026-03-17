// Импортируем все слайсы
import authReducer from './slices/auth-slice';
import feedReducer from './slices/feed-slice';
import ingredientsReducer from './slices/ingredients-slice';
import orderReducer from './slices/order-slice';

import { constructorReducer } from './slices/constructor-slice';
import { combineSlices } from '@reduxjs/toolkit';

const rootReducer = combineSlices({
  auth: authReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  order: orderReducer
});

// Экспортируем тип RootState
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
