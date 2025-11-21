import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules', 'dist', 'build', 'eslint.config.js'],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^(React|Component|Page|Form|Provider|Route|Router|Routes|Layout|Home|AuthProvider|LanguageProvider|ProtectedRoute|AgreementsForm|VenturesForm|JobsForm|JobSearchForm|AdminPanel|Hero|Description|Impact|Dashboard|AuthModal|Link|Outlet|Header|Footer|AIAssistant|StrictMode|App)',
      }],
      'no-console': 'off',
    },
  },
];
