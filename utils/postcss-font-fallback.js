const postcss = require('postcss')

module.exports = postcss.plugin(
  'postcss-font-fallback',
  ({ modules = false, families }) => root => {
    root.walkDecls('font-family', decl => {
      const [firstFamily, ...fallbackFamilies] = postcss.list.comma(decl.value)
      if (families.find(family => firstFamily.match(new RegExp(family, 'i')))) {
        const rule = decl.parent
        const fallbackRule = rule.cloneAfter({
          selectors: rule.selectors.map(
            selector =>
              modules
                ? `:global(.wf-loading) ${selector}`
                : `.wf-loading ${selector}`,
          ),
        })
        fallbackRule.removeAll()
        fallbackRule.append(
          decl.clone({
            value: fallbackFamilies.join(', '),
          }),
        )
      }
    })
  },
)
