module.exports = {
  root: true,

  env: {
    browser: true,     
    es2021: true
  },

  extends: [
    "react-app",                   
    "plugin:@typescript-eslint/recommended" 
  ],

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: "module"
  },

  plugins: [
    "@typescript-eslint"
  ],

  rules: {

    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react/prop-types": "off"  
  }
};
