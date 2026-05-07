

import '@4tw/cypress-drag-drop';
import * as userData from '../fixtures/user-auth.json';

Cypress.Commands.add('setAuthTokens', () => {
  const authData = {
    accessToken: userData.accessToken,
    refreshToken: userData.refreshToken
  };
  localStorage.setItem('accessToken', authData.accessToken);
  cy.setCookie('refreshToken', authData.refreshToken);
});

Cypress.Commands.add('clearAuthTokens', () => {
  localStorage.removeItem('accessToken');
  cy.clearCookie('refreshToken');
});
