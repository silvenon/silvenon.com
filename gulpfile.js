const gulp = require('gulp')
const del = require('del')
const { spawn } = require('child_process')
const fsx = require('fs-extra')
const esbuild = require('esbuild')

async function clean() {
  await del('dist')
}

function run(cmd, args) {
  return spawn(cmd, args, { stdio: 'inherit' })
}

function buildClient() {
  return run('npx', ['vite', 'build', '--outDir', 'dist/static'])
}

function buildServer() {
  return run('npx', [
    'vite',
    'build',
    '--ssr',
    'src/entry-server.tsx',
    '--outDir',
    'dist/server',
  ])
}

async function generatePages() {
  const { generatePages } = require('./dist/server/entry-server.js')
  const template = await fsx.readFile('dist/static/index.html', 'utf-8')
  generatePages(template)
}

async function generateFeed() {
  const { generateFeed } = require('./dist/server/entry-server.js')
  await generateFeed()
}

async function compileVercelConfig() {
  const { compileVercelConfig } = require('./dist/server/entry-server.js')
  await compileVercelConfig()
}

const ESM_DEPENDENCIES = ['node_modules/xdm/rollup.js']
async function compileEsmDependencies() {
  await Promise.all(
    ESM_DEPENDENCIES.map(async (file) => {
      await esbuild.build({
        entryPoints: [file],
        outfile: file.replace(/\.js$/, '.cjs'),
        platform: 'node',
        format: 'cjs',
        bundle: true,
      })
      const tsDefinition = file.replace(/\.js$/, '.d.ts')
      if (await fsx.pathExists(tsDefinition)) {
        await fsx.copyFile(
          tsDefinition,
          tsDefinition.replace(/\.d.ts$/, '.cjs.d.ts'),
        )
      }
    }),
  )
}

module.exports = {
  build: gulp.series(
    clean,
    gulp.parallel(buildClient, buildServer),
    gulp.parallel(generatePages, generateFeed, compileVercelConfig),
  ),
  compileVercelConfig,
  compileEsmDependencies,
}
