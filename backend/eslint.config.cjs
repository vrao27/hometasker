// eslint.config.cjs
const { configs: eslintConfigs } = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // Base ignores
  {
    ignores: ["**/node_modules/**"]
  },

  // ESLint recommended rules
  eslintConfigs.recommended,

  // Node.js environment rules
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  },
  // Jest test environment rules
  {
    files: ["**/__tests__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest // This adds all Jest globals (describe, it, expect, etc.)
      }
    }
  }
];

// This configuration file sets up ESLint for a Node.js backend project.
// It enables ES2021 features, allows module imports, and applies core recommended rules. 