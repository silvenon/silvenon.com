const mdx = require('@mdx-js/mdx')
const dedent = require('dedent')
const detectFrontmatter = require('remark-frontmatter')
const saveFrontmatter = require('../remark-save-frontmatter')
const removeFrontmatter = require('../remark-remove-frontmatter')
const exportFileData = require('../remark-mdx-export-file-data')

describe('frontmatter', () => {
  it('exports frontmatter', async () => {
    const mdxContent = dedent`
      ---
      title: Hello World!
      ---

      Title is defined via _frontmatter_.
    `

    const result = await mdx(mdxContent, {
      filepath: 'pages/blog/post.mdx',
      remarkPlugins: [
        detectFrontmatter,
        saveFrontmatter,
        removeFrontmatter,
        [exportFileData, 'frontmatter'],
      ],
    })

    expect(result).toMatchInlineSnapshot(`
      "/* @jsx mdx */

      export const frontmatter = {
        \\"title\\": \\"Hello World!\\"
      };
      const makeShortcode = name => function MDXDefaultShortcode(props) {
        console.warn(\\"Component \\" + name + \\" was not imported, exported, or provided by MDXProvider as global scope\\")
        return <div {...props}/>
      };

      const layoutProps = {
        frontmatter
      };
      const MDXLayout = \\"wrapper\\"
      export default function MDXContent({
        components,
        ...props
      }) {
        return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\\"MDXLayout\\">

          <p>{\`Title is defined via \`}<em parentName=\\"p\\">{\`frontmatter\`}</em>{\`.\`}</p>
          </MDXLayout>;
      }

      ;
      MDXContent.isMDXComponent = true;"
    `)
  })
})
