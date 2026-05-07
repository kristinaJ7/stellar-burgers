import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BurgerConstructor } from '../../components/burger-constructor/burger-constructor';
import { TIngredient } from '@utils-types';
import { store } from '../../services/store';
import { MemoryRouter } from 'react-router-dom';

// Моки данных (без изменений)
const mockBun: TIngredient = {
  _id: '1',
  name: 'Флюоресцентная булка R2-D3',
  price: 988,
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  image: 'https://example.com/bun.png',
  image_large: 'https://example.com/bun-large.png',
  image_mobile: 'https://example.com/bun-mobile.png'
};

const mockIngredient: TIngredient = {
  _id: '2',
  name: 'Филе Люминесцентного тетраодонтимформа',
  price: 1068,
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  image: 'https://example.com/ingredient.png',
  image_large: 'https://example.com/ingredient-large.png',
  image_mobile: 'https://example.com/ingredient-mobile.png'
};

// Вспомогательная функция для рендера
const renderWithRouterAndStore = (ui: React.ReactElement, route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Provider store={store}>{ui}</Provider>
    </MemoryRouter>
  );

describe('BurgerConstructor Component - Order Button Logic', () => {
  beforeEach(() => {
    store.dispatch({ type: 'RESET_CONSTRUCTOR' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('кнопка активна для неавторизованного пользователя без булок', async () => {
    renderWithRouterAndStore(<BurgerConstructor />);
    const orderButton = screen.getByTestId('order-button');

    // Кнопка активна даже без булок для неавторизованного
    expect(orderButton).not.toBeDisabled();
  });

  it('кнопка активна для авторизованного пользователя без булок', async () => {
    // Устанавливаем авторизацию
    await act(async () => {
      store.dispatch({ type: 'SET_AUTH_CHECKED', payload: true });
      store.dispatch({ type: 'SET_IS_AUTHENTICATED', payload: true });
    });

    renderWithRouterAndStore(<BurgerConstructor />);

    const orderButton = screen.getByTestId('order-button');

    // Для авторизованного пользователя кнопка активна даже без булок
    await waitFor(
      () => {
        expect(orderButton).not.toBeDisabled();
      },
      { timeout: 3000 }
    );
  });

  it('кнопка активна для авторизованного пользователя с булкой', async () => {
    // Устанавливаем авторизацию
    await act(async () => {
      store.dispatch({ type: 'SET_AUTH_CHECKED', payload: true });
      store.dispatch({ type: 'SET_IS_AUTHENTICATED', payload: true });
    });

    renderWithRouterAndStore(<BurgerConstructor />);

    // Добавляем булку
    await act(async () => {
      store.dispatch({ type: 'ADD_BUN', payload: mockBun });
    });

    const orderButton = screen.getByTestId('order-button');

    // Для авторизованного с булкой кнопка активна
    await waitFor(
      () => {
        expect(orderButton).not.toBeDisabled();
      },
      { timeout: 3000 }
    );
  });
});
