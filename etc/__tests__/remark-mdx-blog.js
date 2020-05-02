const fsx = require('fs-extra')
const mdx = require('@mdx-js/mdx')
const dedent = require('dedent')
const vfile = require('to-vfile')
const detectFrontmatter = require('remark-frontmatter')
const saveFrontmatter = require('../remark-save-frontmatter')
const removeFrontmatter = require('../remark-remove-frontmatter')
const blog = require('../remark-mdx-blog')

jest.mock('fs')

test('blog features', async () => {
  expect.assertions(1)

  const dir = `${process.cwd()}/src/pages/blog`

  const parts = ['One', 'Two', 'Three']

  const [partOne] = await Promise.all(
    parts.map(async (part, index) => {
      const filePath = `${dir}/${part.toLowerCase()}.mdx`
      await fsx.ensureFile(filePath)
      return vfile.write({
        path: filePath,
        contents: dedent`
          ---
          seriesPart: ${index}
          title: ${part}
          ---

          # Hello World!
        `,
      })
    }),
  )

  await fsx.writeFile(
    `${dir}/series.yml`,
    dedent`
      title: Series
    `,
  )

  await expect(
    mdx(partOne.contents, {
      filepath: partOne.path,
      remarkPlugins: [
        detectFrontmatter,
        saveFrontmatter,
        removeFrontmatter,
        blog,
      ],
    }),
  ).resolves.toMatchInlineSnapshot(`
    "/* @jsx mdx */

    export const series = {
      \\"title\\": \\"Series\\",
      \\"parts\\": [{
        \\"title\\": \\"One\\",
        \\"path\\": \\"/blog/one\\"
      }, {
        \\"title\\": \\"Two\\",
        \\"path\\": \\"/blog/two\\"
      }, {
        \\"title\\": \\"Three\\",
        \\"path\\": \\"/blog/three\\"
      }]
    };
    export const path = \\"/blog/one\\";
    const makeShortcode = name => function MDXDefaultShortcode(props) {
      console.warn(\\"Component \\" + name + \\" was not imported, exported, or provided by MDXProvider as global scope\\")
      return <div {...props}/>
    };

    const layoutProps = {
      series,
    path
    };
    const MDXLayout = \\"wrapper\\"
    export default function MDXContent({
      components,
      ...props
    }) {
      return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\\"MDXLayout\\">


        <h1>{\`Hello World!\`}</h1>
        </MDXLayout>;
    }

    ;
    MDXContent.isMDXComponent = true;"
  `)
})
