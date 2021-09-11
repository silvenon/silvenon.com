import { defineConfig } from 'vite'
import browserslist from 'browserslist'
import yaml from './etc/vite-plugin-yaml'
import reactRefresh from '@vitejs/plugin-react-refresh'
import cloudinary from './etc/vite-plugin-cloudinary'
import xdm from 'xdm/rollup.cjs'

import smartypants from '@silvenon/remark-smartypants'
import unwrapImages from 'remark-unwrap-images'
import prism from 'mdx-prism'

// https://esbuild.github.io/api/#target
const ESBUILD_SUPPORTED_TARGET_NAMES = ['chrome', 'edge', 'firefox', 'safari']

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  server: { open: true },
  build: {
    outDir: isProd ? 'dist/static' : 'dist',
    target: isProd
      ? browserslist()
          .filter((browser) =>
            ESBUILD_SUPPORTED_TARGET_NAMES.some((name) =>
              browser.startsWith(name),
            ),
          )
          .map((browser) => browser.replace(' ', ''))
      : 'modules',
  },
  plugins: [
    yaml(),
    // the xdm plugin needs to come before @vitejs/plugin-react-refresh
    // so that MDX files also benefits from HMR
    // @ts-ignore fuck that
    xdm({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [smartypants, unwrapImages],
      rehypePlugins: [prism],
    }),
    cloudinary(),
    reactRefresh(),
  ],
})
