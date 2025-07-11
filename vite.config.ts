import { defineConfig } from 'vite'
import { defaultExclude } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { reactRouter } from '@react-router/dev/vite'
import mdx from '@mdx-js/rollup'
import remarkFronmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkSmartypants from 'remark-smartypants'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import rehypePrettyCodeConfigured from './etc/rehype-pretty-code-configured'
import cloudinary from './etc/vite-plugin-cloudinary'
import { PORT } from './consts'

const isVitest = process.env.VITEST === 'true'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    isVitest && react(),
    mdx({
      remarkPlugins: [
        remarkFronmatter,
        remarkMdxFrontmatter,
        remarkSmartypants,
      ],
      rehypePlugins: [rehypeUnwrapImages, rehypePrettyCodeConfigured],
    }),
    cloudinary(),
    !isVitest && reactRouter(),
  ],
  define: {
    ...Object.fromEntries(
      Object.entries({
        sm: '40rem', // 640px
        md: '48rem', // 768px
        lg: '64rem', // 1024px
        xl: '80rem', // 1280px
        '2xl': '96rem', // 1536px
      }).map(([key, value]) => [
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
})
