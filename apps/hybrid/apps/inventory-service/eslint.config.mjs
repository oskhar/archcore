import eslintConfig from '@archkit/eslint-config/nestjs.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...eslintConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
