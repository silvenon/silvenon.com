const esbuild = require('esbuild')
const browserslist = require('browserslist')
const { isProd, destDir } = require('../../site.config')

const SUPPORTED_TARGET_NAMES = ['chrome', 'edge', 'firefox', 'safari']

async function buildScripts({ entryPoints, sourcemap = false, write = true }) {
  const result = await esbuild.build({
    entryPoints,
    outdir: destDir,
    bundle: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
    },
    minify: isProd,
    sourcemap,
    target: browserslist()
      .filter((browser) =>
        SUPPORTED_TARGET_NAMES.some((name) => browser.startsWith(name)),
      )
      .map((browser) => browser.replace(' ', '')),
    write,
  })

  if (write) return

  return result
}

module.exports = buildScripts
