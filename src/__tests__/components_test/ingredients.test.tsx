import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Location } from 'react-router-dom';
import { BurgerIngredientUI } from '../../../src/components/ui/burger-ingredient/burger-ingredient';
import { store } from '../../services/store';
import { TIngredient } from '../../utils/types';

// Моки данных с полным соответствием типам
const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0947',
  name: 'Плоды Фалленианского дерева',
  price: 874,
  image: 'https://code.s3.yandex.net/react/code/sp_1.png',
  calories: 77,
  carbohydrates: 55,
  fat: 5,
  type: 'main', // добавлено обязательное поле
  proteins: 20, // добавлено обязательное поле
  image_large: 'https://code.s3.yandex.net/react/code/sp_1_large.png', // добавлено обязательное поле
  image_mobile: 'https://code.s3.yandex.net/react/code/sp_1_mobile.png' // добавлено обязательное поле
};

const mockHandleAdd = jest.fn();

// Создаём моковый объект Location
const mockLocation: Location = {
  pathname: '/constructor',
  search: '',
  hash: '',
  state: null,
  key: 'default'
};

const mockLocationState = { background: mockLocation }; // соответствует типу TBurgerIngredientUIProps

// Вспомогательная функция для рендера
const renderComponent = (props = {}) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <BurgerIngredientUI
          ingredient={mockIngredient}
          count={0}
          handleAdd={mockHandleAdd}
          locationState={mockLocationState}
          {...props}
        />
      </MemoryRouter>
    </Provider>
  );

describe('BurgerIngredientUI', () => {
  beforeEach(() => {
    mockHandleAdd.mockClear();
  });

  it('renders ingredient item with basic information', () => {
    renderComponent();

    // Проверяем наличие названия ингредиента
    const ingredientName = screen.getByText('Плоды Фалленианского дерева');
    expect(ingredientName).toBeInTheDocument();

    // Проверяем цену
    const price = screen.getByText('874');
    expect(price).toBeInTheDocument();

    // Проверяем изображение
    const image = screen.getByAltText(
      'Изображение ингредиента Плоды Фалленианского дерева'
    );
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://code.s3.yandex.net/react/code/sp_1.png'
    );
  });

  it('shows counter when count > 0', () => {
    renderComponent({ count: 2 });

    // Ищем текст счётчика внутри контейнера с классом счётчика
    const counterText = screen.getByText('2');
    expect(counterText).toBeInTheDocument();

    // Дополнительно проверяем, что текст находится внутри контейнера счётчика
    expect(counterText.closest('.counter.default')).toBeInTheDocument();
  });

  it('hides counter when count is 0', () => {
    renderComponent({ count: 0 });
    expect(() => screen.getByText('2')).toThrow(); // проверяем, что текст '2' не найден
  });

  it('calls handleAdd when button is clicked', () => {
    renderComponent();

    // Находим кнопку по тексту и роли
    const button = screen.getByRole('button', { name: /Добавить/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockHandleAdd).toHaveBeenCalledTimes(1);
  });

  it('has correct link to ingredient details', () => {
    renderComponent();

    // Находим ссылку по href
    const link = screen.getByRole('link', {
      name: /Плоды Фалленианского дерева/i
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      '/ingredients/643d69a5c3f7b9001cfa0947'
    );
  });
});
