// eslint.config.js
const js = require('@eslint/js');
const ts = require('@typescript-eslint/eslint-plugin');
const reactRecommended = require('eslint-plugin-react/configs/recommended');
const globals = require('globals');

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
 
