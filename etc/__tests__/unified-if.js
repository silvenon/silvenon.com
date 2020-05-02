const dedent = require('dedent')
const mdx = require('@mdx-js/mdx')
const defaultLayout = require('../remark-mdx-default-layout')
const unifiedIf = require('../unified-if')

jest.mock('fs')

test('add unified plugins conditionally', async () => {
  const ifPost = (plugin) => [
    unifiedIf,
    (tree, file) => (file.path === 'custom.mdx' ? plugin : null),
  ]

  const remarkPlugins = [ifPost([defaultLayout, 'post-layout.tsx'])]

  expect(
    await mdx(
      dedent`
      # With built-in layout
    `,
      {
        filepath: 'built-in.mdx',
        remarkPlugins,
      },
    ),
  ).toMatchSnapshot()

  expect(
    await mdx(
      dedent`
      # With custom layout
    `,
      {
        filepath: 'custom.mdx',
        remarkPlugins,
      },
    ),
  ).toMatchSnapshot()
})
