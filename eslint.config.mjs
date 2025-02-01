import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'prisma/migrations',
      'webpack.config.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'error',
      'no-undef': 'error',
      eqeqeq: 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
  prettier,
];
