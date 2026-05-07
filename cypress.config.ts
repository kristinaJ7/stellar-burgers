
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    supportFile: 'cypress/support/index.ts',
    setupNodeEvents(on, config) {
      return config;
    }
  }
});

