# [silvenon.com](https://silvenon.com/)

This is my blog, it's based on the [Remix Indie Stack](https://github.com/remix-run/indie-stack).

## What's in here?

- [Vite](https://vitejs.dev/) for developing and building the app
- The [Remix](https://remix.run) framework as a Vite plugin
- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Images hosted and otpimized by [Cloudinary](https://cloudinary.com)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Playwright](https://playwright.dev)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static types with [TypeScript](https://typescriptlang.org)
- Managing git hooks and custom scripts with [Lefthook](https://github.com/evilmartians/lefthook)

## Setup

You only need to run this once:

  ```sh
  npm run setup
  ```

## Development

  ```sh
  npm run dev
  ```

## Validate

  ```sh
  npm run lint # lint code
  npm run pretty # check formatting
  npm test # run unit and end-to-end tests
  npm run test:unit # run unit tests
  npm run test:e2e # run end-to-end tests
  npm run typecheck # check types

  npm run validate # run all of the above
  ```

## Build

  ```sh
  npm run build
  ```

## Deployment

Deployment happens automatically after changes are pushed to GitHub.
