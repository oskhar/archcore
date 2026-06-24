import baseConfig from './index.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
