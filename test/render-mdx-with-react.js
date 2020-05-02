const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { MDXProvider, mdx: createElement } = require('@mdx-js/react')
const mdx = require('@mdx-js/mdx')
const BabelPluginExtractImportNames = require('babel-plugin-extract-import-names')
const removeImports = require('remark-mdx-remove-imports')
const { transform: babelTransform } = require('@babel/core')
const prettier = require('prettier')
const filter = require('unist-util-filter')

const pluginTransformReactJsx = require('@babel/plugin-transform-react-jsx')
const pluginObjectRestSpread = require('@babel/plugin-proposal-object-rest-spread')
const pluginRemoveExportKeywords = require('babel-plugin-remove-export-keywords')

class RemarkExtractImportNames {
  constructor() {
    const babelPluginExtractImportNames = new BabelPluginExtractImportNames()
    const remarkExtractImportNames = () => (tree, file) => {
      const imports = filter(tree, 'import')
        .children.map((node) => node.value)
        .join('\n')
      const result = babelTransform(imports, {
        configFile: false,
        filename: file.path,
        plugins: [babelPluginExtractImportNames.plugin],
      })
      this.state = {
        names: result.state.names,
      }
    }
    this.plugin = remarkExtractImportNames
  }
}

const transformJsx = (code, { filename } = {}) =>
  babelTransform(code, {
    configFile: false,
    filename,
    plugins: [
      pluginTransformReactJsx,
      pluginObjectRestSpread,
      pluginRemoveExportKeywords,
    ],
  })

const renderMdxWithReact = async (
  mdxCode,
  { scope: moduleScope, remarkPlugins = [], ...options } = {},
  providerProps = {},
) => {
  const extractImportNames = new RemarkExtractImportNames()
  const jsx = await mdx(mdxCode, {
    ...options,
    remarkPlugins: [...remarkPlugins, extractImportNames, removeImports],
    skipExport: true,
  })
  const result = transformJsx(jsx, { filename: options.filename })
  const scope = {
    mdx: createElement,
    ...moduleScope,
  }

  const fn = new Function( // eslint-disable-line no-new-func
    'React',
    ...Object.keys(scope),
    `${result.code}; return React.createElement(MDXContent)`,
  )

  const element = fn(React, ...Object.values(scope))

  const elementWithProvider = React.createElement(
    MDXProvider,
    providerProps,
    element,
  )

  const html = renderToStaticMarkup(elementWithProvider)

  const prettierOptions = await prettier.resolveConfig(process.cwd())

  return prettier
    .format(html, {
      ...prettierOptions,
      parser: 'html',
    })
    .trim()
}

module.exports = renderMdxWithReact
