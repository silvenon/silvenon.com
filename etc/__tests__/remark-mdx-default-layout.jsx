const React = require('react')
const dedent = require('dedent')
const defaultLayout = require('../remark-mdx-default-layout')
const renderMdxWithReact = require('../../test/render-mdx-with-react')

describe('default layout', () => {
  it('adds unless one is already defined', async () => {
    const DefaultLayout = (props) => (
      <div data-testid="DefaultLayout" {...props} />
    )
    const ExistingLayout = (props) => (
      <div data-testid="ExistingLayout" {...props} />
    )

    const renderContent = (mdxContent) =>
      renderMdxWithReact(mdxContent, {
        filepath: 'pages/blog/post.mdx',
        remarkPlugins: [
          [
            defaultLayout,
            {
              name: DefaultLayout.name,
              path: `components/layout.tsx`,
            },
          ],
        ],
        scope: {
          DefaultLayout,
          ExistingLayout,
        },
      })

    const withoutLayout = dedent`
      # Hello World!
    `
    expect(await renderContent(withoutLayout)).toMatchInlineSnapshot(
      `"<div data-testid=\\"DefaultLayout\\"><h1>Hello World!</h1></div>"`,
    )

    const withLayout = dedent`
      import ExistingLayout from './components/layout'
      export default ExistingLayout

      # Hello World!
    `
    expect(await renderContent(withLayout)).toMatchInlineSnapshot(
      `"<div data-testid=\\"ExistingLayout\\"><h1>Hello World!</h1></div>"`,
    )
  })
})
