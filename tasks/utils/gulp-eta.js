const Eta = require('eta')
const PluginError = require('plugin-error')
const transform = require('through2').obj
const path = require('path')

Eta.configure({
  views: path.join(process.cwd(), 'views'),
  cache: true,
})

function gulpEtaCompile(config) {
  return transform((file, enc, cb) => {
    if (file.isBuffer) {
      try {
        Eta.templates.define(
          file.path,
          Eta.compile(file.contents.toString(), config),
        )
      } catch (err) {
        cb(new PluginError('gulp-eta-compile', err, { showStack: true }))
        return
      }
    }
    cb(null, file)
  })
}

function gulpEtaRender(config) {
  return transform(async (file, enc, cb) => {
    if (file.isBuffer()) {
      try {
        const result = await Eta.renderFile(file.path, file.data, config)
        file.contents = Buffer.from(result)
      } catch (err) {
        cb(new PluginError('gulp-eta-render', err, { showStack: true }))
        return
      }
    }
    cb(null, file)
  })
}

function gulpEtaLayout(layoutPath, config) {
  return transform(async (file, enc, cb) => {
    if (file.isBuffer()) {
      try {
        const result = await Eta.renderFile(
          layoutPath,
          {
            ...file.data,
            contents: file.contents.toString(),
          },
          config,
        )
        file.contents = Buffer.from(result)
      } catch (err) {
        cb(new PluginError('gulp-eta-layout', err, { showStack: true }))
        return
      }
    }
    cb(null, file)
  })
}

module.exports = {
  compile: gulpEtaCompile,
  render: gulpEtaRender,
  layout: gulpEtaLayout,
}
