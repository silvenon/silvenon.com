const getImportPath = require('../get-import-path')

test(getImportPath.name, () => {
  expect(getImportPath(`foo/bar/baz.js`, 'foo/bar.js')).toBe('../bar')
  expect(getImportPath(`foo/bar/baz.js`, 'foo/bar/qux.js')).toBe('./qux')
  expect(getImportPath(`foo/bar/baz`, 'foo/bar/qux.js')).toBe('../qux')
})
