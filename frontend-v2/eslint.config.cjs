

/**
 * Flat‐format ESLint config for React + TypeScript.
 * Placed at the root of the frontend-v2 folder.
 */

const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  
  {
    ignores: ["node_modules/**", "build/**"],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
  },

 
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

