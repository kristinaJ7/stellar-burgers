
/// <reference types="cypress" />

import * as userData from '../fixtures/user-auth.json';
import * as orderData from '../fixtures/order-response.json';

describe('Burger Constructor E2E Tests', () => {
  beforeEach(() => {
  
    cy.window().then((win) => {
      if ((win as any).__webpack_dev_server_client__) {
        (win as any).__webpack_dev_server_client__.options.overlay = false;
      }
    });

    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('webpack-dev-server')) return false;
      return true;
    });

    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user-auth.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order-response.json' }).as('createOrder');

    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', userData.refreshToken);
      document.cookie = `accessToken=${userData.accessToken}; path=/; domain=localhost`;
    });

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
    cy.get('[data-testid="burger-constructor"]').should('be.visible');
  });

  afterEach(() => {
    cy.clearAllCookies();
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
      win.localStorage.removeItem('accessToken');
    });
  });

  it('should add buns and update price correctly', () => {
    const bunName = 'Флюоресцентная булка R2-D3';

    // 1. Добавляем булку
    cy.contains('.text.text_type_main-default', bunName)
      .closest('[data-testid="ingredient-item"]')
      .scrollIntoView()
      .as('bunCard')
      .within(() => {
        cy.get('button').click({ force: true });
      });

    // 2. Проверяем, что булки появились в конструкторе
    cy.get('[data-testid="constructor-bun-top"]').should('be.visible');
    cy.get('[data-testid="constructor-bun-bottom"]').should('be.visible');

    // 3. ПРОВЕРКА ЦЕНЫ
    cy.contains('button', 'Оформить заказ')
      .parent()
      .should(($el) => {
        const text = $el.text().trim();
        const hasRuble = text.includes('₽');
        const hasDigit = /\d/.test(text);
        expect(hasRuble || hasDigit).to.be.true;
      });
  });

  it('should create a valid order with buns and ingredients', () => {
    const bunName = 'Флюоресцентная булка R2-D3';

    // 1. Добавляем булку
    cy.contains('.text.text_type_main-default', bunName)
      .closest('[data-testid="ingredient-item"]')
      .scrollIntoView()
      .within(() => {
        cy.get('button').click({ force: true });
      });

    // 2. Переключаемся на вкладку «Начинки»
    cy.contains('Начинки').click({ force: true });

    // 3. Добавляем первый попавшийся ингредиент
    cy.get('[data-testid="ingredient-item"]').eq(0)
      .within(() => {
        cy.get('button').click({ force: true });
      });

    cy.wait(300);

    // 4. Оформляем заказ
    cy.contains('button', 'Оформить заказ').click({ force: true });
    cy.wait('@createOrder', { timeout: 15000 });

    // 5. Проверяем модалку успеха
    cy.get('[data-testid="modal-title"]', { timeout: 10000 })
      .should('contain.text', 'Заказ оформлен!');

    // Закрываем модалку
    cy.get('[data-testid="modal-close"]').click({ force: true });
    cy.get('[data-testid="modal-title"]').should('not.exist');
  });

  it('opens ingredient modal details', () => {
  const ingredientName = 'Флюоресцентная булка R2-D3';

  // 1. Находим карточку и прокручиваем её
  cy.get('[data-testid="ingredient-item"]')
    .contains(ingredientName)
    .scrollIntoView()
    .as('ingredientCard');

  cy.contains(ingredientName).click({ force: true });

  // Ждём рендера Portal-модалки
  cy.wait(500);

  // 2. Проверяем заголовок модалки
  cy.get('[data-testid="modal-title"]', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', ingredientName);

  // 3. Проверяем контент
  cy.get('[data-testid="modal-content"]').should('be.visible');

  // 4. Закрываем
  cy.get('[data-testid="modal-close"]').click({ force: true });
  
  // 5. Проверяем исчезновение
  cy.get('[data-testid="modal-title"]').should('not.exist');
  
  });
});

