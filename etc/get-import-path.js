const path = require('path')

const getImportPath = (from, to) => {
  const fromDir = path.extname(from) ? path.dirname(from) : from
  const relativePath = path.join(
    path.relative(fromDir, path.dirname(to)),
    path.basename(to, path.extname(to)),
  )
  return relativePath.startsWith('../') ? relativePath : `./${relativePath}`
}

module.exports = getImportPath
