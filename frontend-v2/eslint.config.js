import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize compatibility layer
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  {
    ignores: ['**/eslint.config.js']  // or '**/eslint.config.cjs' if you renamed it
  },
  // 1. First - explicitly ignore config and config files
  {
    files: ['**/*.{js,cjs,mjs}'],
    ignores: [
      '**/eslint.config.js', 
      '**/.eslintrc.*',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**'
    ]
  },

  // 2. Apply TypeScript and React rules
  ...compat.config({
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
      ecmaFeatures: {
        jsx: true
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // Disable no-explicit-any completely
      '@typescript-eslint/no-explicit-any': 'off',
      
      // Other TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      
      // Disable conflicting base rules
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  })
];