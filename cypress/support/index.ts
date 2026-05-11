
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Устанавливает фейковые токены авторизации в localStorage и cookie
       * @example cy.setAuthTokens()
       */
      setAuthTokens(): Chainable<void>;

      /**
       * Очищает токены авторизации из localStorage и cookie
       * @example cy.clearAuthTokens()
       */
      clearAuthTokens(): Chainable<void>;

      /**
       * Находит ингредиент по имени (регистронезависимо)
       * @param ingredientName - Название ингредиента для поиска
       * @example cy.findIngredient('Флюоресцентная булка R2-D3')
       */
      findIngredient(ingredientName: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Скрывает оверлей Webpack Dev Server
       */
      hideWebpackOverlay(): Chainable<void>;

      /**
       * Закрывает модальный оверлей приложения
       */
      closeModalOverlay(): Chainable<void>; 
    }
  }
}

export {};
