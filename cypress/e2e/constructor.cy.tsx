

/// <reference types="cypress" />


import '@4tw/cypress-drag-drop';
import * as userData from '../fixtures/user-auth.json';
import * as orderData from '../fixtures/order-response.json';
import * as ingredientsData from '../fixtures/ingredients.json';
import '../support/commands';
import '../support/index';


function findIngredient(ingredientName: string) {
  return cy.contains('.text.text_type_main-default', ingredientName, {
    matchCase: false,
    timeout: 30000
  })
    .scrollIntoView({ duration: 500 })
    .should('be.visible') // добавлена проверка видимости
    .first();
}

describe('Stellar Burger Constructor E2E Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/translate-pa.googleapis.com/**', { statusCode: 404 }).as('blockTranslate');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '/api/auth/token', { fixture: 'user-auth.json' }).as('authToken');
    cy.intercept('POST', '/api/orders', { fixture: 'order-response.json' }).as('createOrder');


    cy.setAuthTokens();
    cy.visit('/');

    // Ждём загрузки ингредиентов и проверяем их наличие
    cy.wait('@getIngredients', { timeout: 10000 });
    cy.get('[data-testid="ingredient-item"]', { timeout: 15000 })
      .should('have.length.greaterThan', 0)
      .and('be.visible'); // добавлена проверка видимости
  });

  afterEach(() => {
    cy.clearAuthTokens();
  });

  it('добавляет ингредиент из списка ингредиентов в конструктор через кнопку "Добавить"', () => {
    const ingredientName = 'Флюоресцентная булка R2-D3';

    findIngredient(ingredientName)
      .closest('[data-testid="ingredient-item"]')
      .within(() => {
        cy.get('button[type="button"]')
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });

    // Проверяем появление булки в конструкторе
    cy.get('[data-testid="constructor-bun-top"]', { timeout: 6000 })
      .should('contain', ingredientName)
      .and('be.visible');
  });

  it('открывает и закрывает модальное окно с описанием ингредиента', () => {
    findIngredient('Флюоресцентная булка R2-D3')
      .closest('[data-testid="ingredient-item"]')
      .find('a') // кликаем по ссылке внутри контейнера, а не по всему контейнеру
      .should('be.visible')
      .click({ force: true });

    // Ищем модальное окно по единому селектору с увеличенным таймаутом
    cy.get('[data-testid="modal"]', { timeout: 8000 })
      .should('be.visible');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]', { timeout: 4000 })
      .should('be.visible')
      .click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('создаёт заказ: добавляет ингредиенты, оформляет заказ, проверяет номер и очищает конструктор', () => {
    // Проверяем пустой конструктор через плейсхолдеры
    cy.get('[data-testid="constructor-no-buns-top"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="constructor-no-ingredients"]', { timeout: 5000 }).should('be.visible');

    const ingredientsToAdd = [
      'Флюоресцентная булка R2-D3',
      'Филе Люминесцентного тетраодонтимформа',
      'Соус с шипами Антарианского плоскоходца'
    ];

    ingredientsToAdd.forEach(ingredient => {
      findIngredient(ingredient)
        .closest('[data-testid="ingredient-item"]')
        .within(() => {
          cy.get('button[type="button"]')
            .should('be.visible')
            .click({ force: true });
        });
    });

    // Прокручиваем кнопку заказа в видимую область и кликаем
    cy.get('[data-testid="order-button"]', { timeout: 5000 })
      .scrollIntoView()
      .should('be.visible')
      .click();

    // Ждём ответа от сервера
    cy.wait('@createOrder', { timeout: 8000 });

    // Проверяем успешное модальное окно заказа
    cy.get('[data-testid="modal"]', { timeout: 8000 })
      .should('be.visible');

    // Проверяем номер заказа
    cy.contains('12345', { timeout: 5000 }).should('be.visible');

    // Закрываем модальное окно заказа
    cy.get('[data-testid="modal-close"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');


    // Проверяем, что конструктор показывает плейсхолдеры (очищен)
    cy.get('[data-testid="constructor-no-buns-top"]').should('be.visible');
    cy.get('[data-testid="constructor-no-ingredients"]').should('be.visible');
  });
});
