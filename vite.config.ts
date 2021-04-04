import { defineConfig } from 'vite'
import browserslist from 'browserslist'
import yaml from './etc/vite-plugin-yaml'
import reactRefresh from '@vitejs/plugin-react-refresh'
import mdx from 'vite-plugin-mdx'
import { mdxOptions } from './etc/mdx'
import cloudinary from './etc/vite-plugin-cloudinary'

// https://esbuild.github.io/api/#target
const ESBUILD_SUPPORTED_TARGET_NAMES = ['chrome', 'edge', 'firefox', 'safari']

const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
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
    // vite-plugin-mdx needs to come before @vitejs/plugin-react-refresh
    // so that MDX files also benefits from HMR
    // @ts-ignore fuck that
    mdx(mdxOptions),
    cloudinary(),
    reactRefresh(),
  ],
})
