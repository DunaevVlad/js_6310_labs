module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'indent': ['error', 2],
    'semi': ['error', 'never'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
