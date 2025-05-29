
/**
 * Flat‐format ESLint config for backend JS.
 * Placed at the root of the backend folder.
 */

const { rules: baseRules } = require("eslint/conf/eslint-recommended"); 

module.exports = [

  {
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  {
    files: ["**/*.js"],
    rules: {
      
      ...baseRules,
    
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console":     ["warn", { allow: ["warn", "error"] }],
    },
  },
];


// This configuration file sets up ESLint for a Node.js backend project.
// It enables ES2021 features, allows module imports, and applies core recommended rules.