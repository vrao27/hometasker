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
        ...globals.es2022
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
    ...tsPlugin.configs['eslint-recommended'],
    ...tsPlugin.configs['recommended'],
    languageOptions: {
      parser: tsPlugin.parser,
      parserOptions: {
        project: './tsconfig.json' // Explicit path to tsconfig
      }
    }
  },

  // Custom rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-unknown-property': ['error', { ignore: ['css'] }] // Added for CSS-in-JS support
    }
  }
];
 
