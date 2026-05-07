


/// <reference types="cypress" />
import './commands';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Устанавливает фейковые токены авторизации в localStorage и cookie
       */
      setAuthTokens(): Chainable<void>;

      /**
       * Очищает токены авторизации из localStorage и cookie
       */
      clearAuthTokens(): Chainable<void>;
    }
  }
}
