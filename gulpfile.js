const gulp = require('gulp')
const del = require('del')
const { spawn } = require('child_process')
const fsx = require('fs-extra')

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

function generateFeed() {
  const { generateFeed } = require('./dist/server/entry-server.js')
  return generateFeed()
}

function compileVercelConfig() {
  const { compileVercelConfig } = require('./dist/server/entry-server.js')
  return compileVercelConfig()
}

module.exports = {
  build: gulp.series(
    clean,
    gulp.parallel(buildClient, buildServer),
    gulp.parallel(generatePages, generateFeed, compileVercelConfig),
  ),
  compileVercelConfig,
}
