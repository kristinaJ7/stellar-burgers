import '@testing-library/jest-dom';
import 'dotenv/config';
process.env.NODE_ENV = 'test';
process.env.BURGER_API_URL =
  process.env.BURGER_API_URL || 'https://test-api.example.com';
