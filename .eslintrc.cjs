/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['eslint:recommended'],
  rules: {
    'no-var': 'error',
    'prefer-const': 'error',
    'no-warning-comments': 'warn',
    'no-use-before-define': ['error', { functions: false }],
  },
  overrides: [
    {
      files: ['.eslintrc.cjs'],
      env: { node: true },
    },
    {
      files: ['*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        project: ['./tsconfig.app.json', './integration/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-floating-promises': 'error',
      },
    },
    {
      files: ['*.tsx'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      files: ['*.{test,spec}.{ts,tsx}'],
      extends: ['plugin:testing-library/react'],
    },
    {
      files: './integration/**/*.spec.ts',
      rules: {
        'testing-library/prefer-screen-queries': 'off',
      },
    },
    {
      files: ['**/*'],
      extends: ['prettier'],
    },
  ],
}
