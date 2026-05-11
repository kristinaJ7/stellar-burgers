/// <reference types="cypress" />

import * as userData from '../fixtures/user-auth.json';
import * as orderData from '../fixtures/order-response.json';
import * as ingredientsData from '../fixtures/ingredients.json';
import '../support/commands';

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('webpack-dev-server')) {
        return false;
      }
    });

    // Скрываем оверлей Webpack Dev Server
    cy.hideWebpackOverlay();

    // Перехватываем запросы к API
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user-auth.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order-response.json' }).as('createOrder');

    // Устанавливаем токены авторизации
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie =
        'accessToken=test-access-token; path=/; domain=localhost; secure; samesite=strict';
    });

    // Открываем страницу конструктора
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    // Ждём, пока ингредиенты отрендерятся
    cy.get('[data-testid="burger-constructor"]').should('exist');
    cy.get('[data-testid="ingredient-item"]', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0
    );
  });

  it('should add ingredients to constructor', () => {
    cy.get('[data-testid="burger-constructor"]').should('exist');

    // Добавляем булку
    cy.get('[data-testid="ingredient-item"]', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('button[type="button"]').click({ force: true });
      });

    // Проверяем наличие булок в конструкторе (верх и низ)
    cy.get('[data-testid="constructor-bun-top"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="constructor-bun-bottom"]', { timeout: 10000 }).should('exist');

    // Обновляем ожидаемую цену: 1976 вместо 988 (988 × 2)
    cy.contains('button', 'Оформить заказ')
      .parent('div')
      .find('p.text')
      .should('contain.text', '1976', 'Price should be 1976 after adding bun (both top and bottom)');
  });

  it('should create order with ingredients', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-item"]', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('button[type="button"]').click({ force: true });
      });

    // Добавляем начинку
    cy.contains('Начинки').click({ force: true });
    cy.get('[data-testid="ingredient-item"]')
      .contains('.text.text_type_main-default', 'Филе Люминесцентного тетраодонтимформа')
      .parents('[data-testid="ingredient-item"]')
      .scrollIntoView()
      .within(() => {
        cy.get('button[type="button"]').click({ force: true });
      });

    // Нажимаем кнопку оформления заказа
    cy.contains('button', 'Оформить заказ')
      .scrollIntoView() // Прокрутка в видимую область
      .click({ force: true, timeout: 5000 }); // Принудительный клик с увеличенным таймаутом

    // Проверяем открытие модального окна
    cy.get('[data-testid="order-modal"]', { timeout: 10000 }).should('be.visible');

    // Проверяем номер заказа
    cy.get('[data-testid="order-number"]').should('contain.text', orderData.order.number);

    // Закрываем модальное окно
    cy.closeModalOverlay();
  });

  afterEach(() => {
    // Очищаем токены авторизации
    cy.clearAllCookies();
    cy.window().then((window) => {
      window.localStorage.removeItem('refreshToken');
    });
  });
});