const mdx = require('@mdx-js/mdx')
const dedent = require('dedent')
const excerpt = require('../rehype-mdx-excerpt')

describe('excerpt', () => {
  it('includes content above the marker', async () => {
    await expect(
      mdx(
        dedent`
          import Foo from './components/foo'

          # Hello world!

          Included in the excerpt.

          <IgnoreJSX />

          <!-- excerpt -->

          Not included in the excerpt.
        `,
        {
          filepath: 'pages/blog/post.mdx',
          rehypePlugins: [[excerpt, 'excerpt']],
        },
      ),
    ).resolves.toMatchSnapshot()
  })

  it('fails if the marker is missing', async () => {
    await expect(
      mdx(
        dedent`
          import Foo from './components/foo'

          # Hello world!

          Oops, forgot to add the marker!

          <Foo />
        `,
        {
          filepath: 'pages/blog/post.mdx',
          rehypePlugins: [[excerpt, 'excerpt']],
        },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Unable to find the excerpt marker in pages/blog/post.mdx"`,
    )
  })

  it('supports including first X nodes', async () => {
    await expect(
      mdx(
        dedent`
          import Foo from './components/foo'

          # Hello world!

          Included in the excerpt.

          <IgnoreJSX />

          Not included in the excerpt.
        `,
        {
          filepath: 'pages/blog/post.mdx',
          rehypePlugins: [[excerpt, 3]],
        },
      ),
    ).resolves.toMatchSnapshot()
  })
})
