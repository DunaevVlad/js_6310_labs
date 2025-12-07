import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/**', 'coverage/**', '**/coverage/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'indent': ['error', 2, {
        'FunctionDeclaration': {
          'parameters': 'first'
        },
        'MemberExpression': 2,
        'SwitchCase': 1
      }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-var': 'error',
    },
  },
];