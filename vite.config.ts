import { defineConfig } from 'vite'
import { defaultExclude } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { vitePlugin as remix } from '@remix-run/dev'
import { metronome } from 'metronome-sh/vite'
import mdx from '@mdx-js/rollup'
import { mdxOptions } from './etc/mdx'

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths(),
    mode === 'test' && react(),
    mdx(mdxOptions),
    mode !== 'test' &&
      remix({
        ignoredRouteFiles: ['**/*.test.{ts,tsx}'],
      }),
    mode === 'production' && metronome(),
  ],
  test: {
    globals: true,
    setupFiles: ['./test/setup-test-env.ts'],
    exclude: [...defaultExclude, './integration/**'],
  },
}))
