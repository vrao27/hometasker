import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

export default [
  // First - ignore config file itself
  {
    files: ['**/*.{js,cjs,mjs}'],
    ignores: ['eslint.config.js']
  },
  
  // Then - apply rules
  ...compat.config({
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn', 
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  })
];