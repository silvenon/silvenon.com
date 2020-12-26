const browserSync = require('browser-sync')
const { destDir } = require('../site.config')

const server = browserSync.create()
const port = 3000
const path = '/'

function initServer(done) {
  server.init(
    {
      port,
      server: destDir,
      ui: false,
      open: false,
      notify: false,
      files: [
        `${destDir}/**/*.html`,
        `${destDir}/**/*.css`,
        `${destDir}/**/*.js`,
      ],
    },
    done,
  )
}

function reloadServer(done) {
  server.reload()
  done()
}

function exitServer(done) {
  server.exit()
  done()
}

module.exports = {
  init: initServer,
  exit: exitServer,

  stream: server.stream,
  reload: reloadServer,
  port,
  path,
}
