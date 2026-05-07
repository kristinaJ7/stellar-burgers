module.exports = {
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.tsx',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@ui-pages(.*)$': '<rootDir>/src/components/ui/pages$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1',
    '^@api(.*)$': '<rootDir>/src/utils/burger-api',
    '^@slices(.*)$': '<rootDir>/src/services/slices$1',
    '^@selectors(.*)$': '<rootDir>/src/services/selectors$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json'
    }],
    '^.+\\.jsx?$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};