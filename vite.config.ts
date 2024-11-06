import { defineConfig } from 'vite'
import { defaultExclude } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import mdx from '@mdx-js/rollup'
import remarkFronmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkSmartypants from 'remark-smartypants'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import rehypePrettyCodeConfigured from './etc/rehype-pretty-code-configured'
import cloudinary from './etc/vite-plugin-cloudinary'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './tailwind.config.js'
import { PORT } from './consts'

installGlobals()

const fullTailwindConfig = resolveConfig(tailwindConfig)

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      tsconfigPaths(),
      mode === 'test' && react(),
      mdx({
        remarkPlugins: [
          remarkFronmatter,
          remarkMdxFrontmatter,
          remarkSmartypants,
        ],
        rehypePlugins: [rehypeUnwrapImages, rehypePrettyCodeConfigured],
      }),
      cloudinary(),
      mode !== 'test' &&
        remix({
          ignoredRouteFiles: ['**/*.test.{ts,tsx}'],
        }),
    ],
    define: {
      ...Object.fromEntries(
        Object.entries(fullTailwindConfig.theme.screens).map(([key, value]) => [
          `import.meta.env.SCREEN_${key.toUpperCase()}`,
          JSON.stringify(value),
        ]),
      ),
    },
    server: {
      port: PORT,
    },
    build: {
      assetsInlineLimit(filePath) {
        if (filePath.endsWith('sprite.svg')) {
          return false
        }
      },
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./test/setup-test-env.ts'],
      exclude: [...defaultExclude, './integration/**'],
    },
  }
})
