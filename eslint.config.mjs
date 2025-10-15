// @ts-check
import eslint from '@eslint/js';                         // Reglas base de ESLint
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; // Integración con Prettier
import globals from 'globals';                            // Define variables globales seguras (node, jest)
import tseslint from 'typescript-eslint';                 // Soporte para TypeScript

export default tseslint.config(
  {
    // 🔸 Archivos que ESLint no analizará
    ignores: ['eslint.config.mjs', 'dist', 'node_modules'],
  },

  // 🔹 Configuración recomendada de ESLint base
  eslint.configs.recommended,

  // 🔹 Configuración recomendada para TypeScript
  ...tseslint.configs.recommended,

  // 🔹 Prettier: evita conflictos de formato
  eslintPluginPrettierRecommended,

  // 🔹 Configuración del entorno de ejecución
  {
    languageOptions: {
      globals: {
        ...globals.node,   // Variables de Node (process, __dirname, etc.)
        ...globals.jest,   // Variables de Jest (describe, it, expect, etc.)
      },
      sourceType: 'module', // Usa módulos ECMAScript
      ecmaVersion: 'latest' // Versión moderna de JavaScript
    },
  },

  // 🔹 Reglas personalizadas
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',             // Permite `any` pero advierte
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignora variables iniciadas con "_"
      '@typescript-eslint/no-unsafe-call': 'off',               // Desactiva falsos positivos de decoradores
      '@typescript-eslint/no-unsafe-return': 'off',
      'no-console': 'off',                                      // Permite console.log
      'no-debugger': 'warn',
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],     // Ajusta saltos de línea para Windows/Linux
    },
  },
);
