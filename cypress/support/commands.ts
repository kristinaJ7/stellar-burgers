
import '@4tw/cypress-drag-drop';
import * as userData from '../fixtures/user-auth.json';

/**
 * Устанавливает фейковые токены авторизации в localStorage и cookie
 * @example cy.setAuthTokens()
 */
Cypress.Commands.add('setAuthTokens', () => {
  const accessToken = userData.accessToken;
  const refreshToken = userData.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new Error('Missing auth tokens in fixture: accessToken or refreshToken');
  }

  localStorage.setItem('accessToken', accessToken);
  cy.setCookie('refreshToken', refreshToken, {
    path: '/',
    domain: Cypress.config().baseUrl?.replace(/^https?:\/\//, '') || 'localhost'
  });
});

/**
 * Очищает токены авторизации из localStorage и cookie
 * @example cy.clearAuthTokens()
 */
Cypress.Commands.add('clearAuthTokens', () => {
  localStorage.removeItem('accessToken');
  cy.clearCookie('refreshToken');
});

/**
 * Находит ингредиент по имени (регистронезависимо)
 * @param ingredientName - Название ингредиента для поиска
 * @example cy.findIngredient('Флюоресцентная булка R2-D3')
 */
Cypress.Commands.add('findIngredient', (ingredientName: string) => {
  return cy.get('[data-testid="ingredient-item"]', { timeout: 15000 })
    .should('have.length.gt', 0, 'No ingredients found in the list')
    .contains('.text.text_type_main-default', ingredientName, {
      matchCase: false,
      timeout: 15000
    })
    .scrollIntoView({ duration: 200 })
    .should('be.visible', `Ingredient "${ingredientName}" should be visible`)
    .parent()
    .should('exist', `Parent element for "${ingredientName}" should exist`);
});

/**
 * Скрывает оверлей Webpack Dev Server
 */
Cypress.Commands.add('hideWebpackOverlay', () => {
  cy.get('body')
    .then(($body) => {
      const iframe = $body.find('iframe#webpack-dev-server-client-overlay');
      if (iframe.length) {
        iframe.hide();
        cy.log('Webpack Dev Server overlay hidden');
      } else {
        cy.log('No Webpack overlay found — continuing test');
      }
    });
});

/**
 * Закрывает модальный оверлей приложения
 */
Cypress.Commands.add('closeModalOverlay', () => {
  cy.get('[data-testid="modal-overlay"]', { timeout: 5000 })
    .then(($overlay) => {
      if ($overlay.is(':visible')) {
        cy.wrap($overlay).click({ force: true });
        cy.get('[data-testid="modal-overlay"]').should('not.be.visible');
        cy.log('Modal overlay closed');
      } else {
        cy.log('Modal overlay not visible — skipping click');
      }
    });
});
