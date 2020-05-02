const jestConfig = require('./jest.config')

module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  plugins: ['react-hooks'],
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  rules: {
    'no-undef': [
      'error',
      {
        typeof: true,
      },
    ],
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/alt-text': [
      'error',
      {
        'img': ['Image', 'ResponsiveImage'],
      },
    ],
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/sort-comp': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
  },

  overrides: [
    {
      files: ['src/**/*.[jt]s?(x)'],
      env: {
        browser: true,
      },
    },
    {
      files: ['**/*.ts?(x)'],
      extends: [
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
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
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
      env: {
        browser: true,
        jest: true,
      },
      rules: {
        'global-require': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      files: 'types/**/*',
      rules: {
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
