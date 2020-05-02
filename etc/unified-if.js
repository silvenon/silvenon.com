const unifiedIf = (getPlugin) => (tree, file) => {
  const plugin = getPlugin(tree, file)

  if (typeof plugin === 'undefined' || plugin === null) {
    return undefined
  }

  if (typeof plugin === 'function') {
    return plugin()(tree, file)
  }

  if (Array.isArray(plugin)) {
    const [attacher, options] = plugin
    return attacher(options)(tree, file)
  }

  return undefined
}

module.exports = unifiedIf
