const jestConfig = require('./jest.config')

module.exports = {
  reportUnusedDisableDirectives: true,
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
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
      files: [
        './*.js',
        'tasks/**/*.js',
        'etc/**/*.js',
        '{tasks,views}/**/__tests__/**/*.test.[jt]s?(x)',
        'test/**/*',
        '**/__mocks__/**/*.js',
      ],
      extends: ['plugin:node/recommended'],
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },
    {
      files: ['scripts/**/*'],
      env: {
        browser: true,
      },
    },
    {
      files: ['*.(j|t)sx'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'prettier/react',
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
        'prettier/@typescript-eslint',
      ],
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
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
      files: 'typings/**/*',
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      files: jestConfig.projects
        .flatMap((project) => project.testMatch)
        .map((path) => path.replace('<rootDir>/', '')),
      extends: ['plugin:jest/recommended'],
      env: {
        browser: true,
        jest: true,
      },
      rules: {
        'jest/expect-expect': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
  ],
}
