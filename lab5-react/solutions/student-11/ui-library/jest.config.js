module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.tsx','**/?(*.)+(spec|test).ts?(x)'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/index.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coverageThreshold: {
    './src/components/ProductCard.tsx': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
