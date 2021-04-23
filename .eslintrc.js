const jestConfig = require('./jest.config')

module.exports = {
  reportUnusedDisableDirectives: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'no-var': 'error',
    'prefer-const': 'error',
    'no-warning-comments': 'warn',
    'no-undef': [
      'error',
      {
        typeof: true,
      },
    ],
    'no-use-before-define': [
      'error',
      {
        functions: false,
      },
    ],
  },
  overrides: [
    {
      files: ['./*.js'],
      extends: ['plugin:node/recommended'],
      rules: {
        'node/no-unpublished-require': 'off',
        'node/no-missing-require': 'off',
      },
    },
    {
      files: ['*.{jsx,tsx}'],
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
      env: {
        browser: true,
      },
      rules: {
        'react/no-danger': 'off',
      },
    },
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: false,
          },
        ],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-extra-semi': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-interface': [
          'error',
          {
            allowSingleExtends: true,
          },
        ],
        'react/jsx-filename-extension': [
          'error',
          {
            extensions: ['.tsx'],
          },
        ],
      },
    },
    {
      files: jestConfig.testMatch,
      extends: ['plugin:jest/recommended'],
      env: {
        browser: true,
        jest: true,
      },
      rules: {
        'jest/expect-expect': 'off',
      },
    },
  ],
}
