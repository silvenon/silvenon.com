/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: ['./test/setup-test-env.ts'],
    include: ['./app/**/*.test.{ts,tsx}', './posts/**/*.test.{ts,tsx}'],
    // fixes importing cloudinary-tiny-js in Node environment
    // https://github.com/vitest-dev/vitest/issues/2258#issuecomment-1301872338
    deps: { interopDefault: true },
  },
})
