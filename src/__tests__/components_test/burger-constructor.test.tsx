

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BurgerConstructor } from '../../components/burger-constructor/burger-constructor';
import { TIngredient } from '@utils-types';
import { store } from '../../services/store';
import { MemoryRouter } from 'react-router-dom';
import { addItem, clearConstructor } from '../../services/slices/constructor-slice';
import { setAuthenticated, clearUser } from '../../services/slices/auth-slice';
import { createOrder } from '../../services/slices/order-slice';
import { selectOrderRequest } from '../../services/slices/order-slice';
import { TConstructorIngredient } from '@utils-types';
const mockBun: TIngredient = {
  _id: '1',
  id: '1',
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
  id: '2',
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

const renderComponent = () => render(
  <MemoryRouter>
    <Provider store={store}>
      <BurgerConstructor />
    </Provider>
  </MemoryRouter>
);

const addIngredientsToConstructor = async () => {
  store.dispatch(addItem(mockBun as TConstructorIngredient));
  store.dispatch(addItem(mockIngredient as TConstructorIngredient));
};


const submitOrder = async () => {
  store.dispatch(createOrder(['1', '2']));
};

describe('BurgerConstructor Component - Order Button Behavior', () => {
  beforeEach(() => {
    store.dispatch(clearConstructor());
    store.dispatch(clearUser());
  });

  it('should have enabled order button by default', () => {
    renderComponent();
    const orderButton = screen.getByTestId('order-button');
    expect(orderButton).not.toBeDisabled();
  });

  it('should disable order button during order submission', async () => {
    await addIngredientsToConstructor();
    renderComponent();

    const orderButton = screen.getByTestId('order-button');
    expect(orderButton).not.toBeDisabled();

    await submitOrder();

    await waitFor(() => {
      const state = store.getState();
      expect(selectOrderRequest(state)).toBe(true);
      expect(orderButton).toBeDisabled();
    }, { timeout: 5000 });
  });

  it('should re-enable order button after order completion', async () => {
    await addIngredientsToConstructor();
    renderComponent();

    const orderButton = screen.getByTestId('order-button');

    await submitOrder();

    await waitFor(() => expect(orderButton).toBeDisabled());

    await waitFor(() => {
      const state = store.getState();
      expect(selectOrderRequest(state)).toBe(false);
      expect(orderButton).not.toBeDisabled();
    }, { timeout: 3000 });
  });

  it('should keep button enabled for authorized user without buns', async () => {
    store.dispatch(setAuthenticated(true));
    renderComponent();
    const orderButton = screen.getByTestId('order-button');
    expect(orderButton).not.toBeDisabled();
  });
});