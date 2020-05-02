const u = require('unist-builder')

const remarkMdxExportFileData = (options = []) => {
  const properties = Array.isArray(options) ? options : [options]

  return (tree, file) => {
    const exportNodes = properties.map((property) => {
      const { key, as: exportAs, stringify = true } =
        typeof property === 'string' ? { key: property } : property

      const value = stringify
        ? JSON.stringify(file.data[key], null, 2)
        : file.data[key]

      return u('export', `export const ${exportAs || key} = ${value}`)
    })

    tree.children = [...exportNodes, ...tree.children]
  }
}

module.exports = remarkMdxExportFileData
