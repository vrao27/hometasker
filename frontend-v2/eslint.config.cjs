// eslint.config.js
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';

export default [
  // Base ignores and settings
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.next/**'
    ]
  },

  // Apply core recommended rules
  js.configs.recommended,

  // React recommended configuration
  {
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2025
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },

  // TypeScript configuration
  {
    files: ['**/*.{ts,tsx}'],
    ...ts.configs['eslint-recommended'],
    ...ts.configs['recommended'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: true // Enable TS project resolution
      }
    }
  },

  // Custom rules
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      'react/jsx-uses-react': 'off', 
      'react/react-in-jsx-scope': 'off', 
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error'
    }
  }
];

