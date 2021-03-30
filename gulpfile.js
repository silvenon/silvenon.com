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
  const entry = require('./dist/server/entry-server.js')
  const template = await fsx.readFile('dist/static/index.html', 'utf-8')
  entry.generatePages(template)
}

function generateFeed() {
  const entry = require('./dist/server/entry-server.js')
  return entry.generateFeed()
}

function compileVercelConfig() {
  const entry = require('./dist/server/entry-server.js')
  return entry.compileVercelConfig()
}

module.exports = {
  build: gulp.series(
    clean,
    gulp.parallel(buildClient, buildServer),
    gulp.parallel(generatePages, generateFeed, compileVercelConfig),
  ),
  compileVercelConfig,
}
