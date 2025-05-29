module.exports = {
  root: true,

  env: {
    node: true,        
    es2021: true,      
  },

  extends: [
    "eslint:recommended" 
  ],

  parserOptions: {
    ecmaVersion: 12,    
    sourceType: "module"
  },

  rules: {
    
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }]
  }
};

// This configuration file sets up ESLint for a Node.js backend project.
// It enables ES2021 features, allows module imports, and applies core recommended rules.