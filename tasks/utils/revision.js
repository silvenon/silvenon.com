const lazypipe = require('lazypipe')
const revisionPath = require('rev-path')
const revisionHash = require('rev-hash')
const transform = require('through2').obj
const { basename } = require('path')

const replacements = new Map()

function revPath(path, content) {
  const revvedPath = revisionPath(path, revisionHash(content))
  replacements.set(basename(path), basename(revvedPath))
  return revvedPath
}

function revRename() {
  return transform((file, enc, cb) => {
    if (file.isBuffer()) {
      file.path = revPath(file.path, file.contents)
    }
    cb(null, file)
  })
}

const revRewrite = lazypipe().pipe(() => {
  return transform((file, enc, cb) => {
    if (file.isBuffer()) {
      let content = file.contents.toString()
      for (const [from, to] of replacements.entries()) {
        content = content.replace(from, to)
      }
      file.contents = Buffer.from(content)
    }
    cb(null, file)
  })
})

module.exports = {
  path: revPath,
  rename: revRename,
  rewrite: revRewrite,
}
