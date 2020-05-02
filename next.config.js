const withPlugins = require('next-compose-plugins')
const mdx = require('@next/mdx')
const detectFrontmatter = require('remark-frontmatter')
const smartypants = require('@silvenon/remark-smartypants')
const headingsSlugId = require('rehype-slug')
const autolinkHeadings = require('rehype-autolink-headings')
const prism = require('mdx-prism')
const saveFrontmatter = require('./etc/remark-save-frontmatter')
const removeFrontmatter = require('./etc/remark-remove-frontmatter')
const exportFileData = require('./etc/remark-mdx-export-file-data')
const defaultLayout = require('./etc/remark-mdx-default-layout')
const excerpt = require('./etc/rehype-mdx-excerpt')
const setUpBlog = require('./etc/remark-mdx-blog')
const { POSTS_DIR } = require('./etc/consts')

module.exports = withPlugins(
  [
    [
      mdx({
        options: {
          remarkPlugins: [
            smartypants,
            detectFrontmatter,
            saveFrontmatter,
            removeFrontmatter,
            [exportFileData, ['frontmatter']],
            [
              defaultLayout,
              {
                path: `${process.cwd()}/src/components/post-layout.tsx`,
                condition: (tree, file) => file.path.startsWith(POSTS_DIR),
              },
            ],
            setUpBlog,
          ],
          rehypePlugins: [
            prism,
            excerpt,
            headingsSlugId,
            [
              autolinkHeadings,
              {
                properties: {
                  ariaHidden: true,
                  dataAutolink: true,
                },
                content: [],
              },
            ],
          ],
        },
      }),
      {
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
      },
    ],
  ],
  {
    webpack: (config, { webpack }) => {
      config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
      config.plugins.push(new webpack.IgnorePlugin(/\/__mocks__\//))
      return config
    },
  },
)
