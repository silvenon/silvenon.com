const { Volume, createFsFromVolume } = require('memfs')
const dedent = require('dedent')
const { POSTS_DIR } = require('../../consts')

test('generate array of post data', () => {
  const vol = Volume.fromJSON(
    {
      'foo.mdx': dedent`
        ---
        title: Foo
        published: 2016-05-02
        ---

        # Foo
      `,
      'series/series.yml': dedent`
        title: My series
      `,
      'series/bar.mdx': dedent`
        ---
        seriesPart: 0
        title: Bar
        published: 2018-04-12
        ---

        # Bar
      `,
      'series/baz.mdx': dedent`
        ---
        seriesPart: 1
        title: Baz
        published: 2017-05-20
        ---

        # Baz
      `,
    },
    POSTS_DIR,
  )

  jest.doMock('fs', () => createFsFromVolume(vol))

  const codegenPostData = require('../post-data')

  expect(codegenPostData()).toMatchInlineSnapshot(`
    "posts = [
      {
        \\"frontmatter\\": {
          \\"seriesPart\\": 0,
          \\"title\\": \\"Bar\\",
          \\"published\\": \\"2018-04-12\\"
        },
        \\"path\\": \\"/blog/series/bar\\",
        \\"series\\": {
          \\"title\\": \\"My series\\",
          \\"parts\\": [
            {
              \\"title\\": \\"Bar\\",
              \\"path\\": \\"/blog/series/bar\\"
            },
            {
              \\"title\\": \\"Baz\\",
              \\"path\\": \\"/blog/series/baz\\"
            }
          ]
        }
      },
      {
        \\"frontmatter\\": {
          \\"seriesPart\\": 1,
          \\"title\\": \\"Baz\\",
          \\"published\\": \\"2017-05-20\\"
        },
        \\"path\\": \\"/blog/series/baz\\",
        \\"series\\": {
          \\"title\\": \\"My series\\",
          \\"parts\\": [
            {
              \\"title\\": \\"Bar\\",
              \\"path\\": \\"/blog/series/bar\\"
            },
            {
              \\"title\\": \\"Baz\\",
              \\"path\\": \\"/blog/series/baz\\"
            }
          ]
        }
      },
      {
        \\"frontmatter\\": {
          \\"title\\": \\"Foo\\",
          \\"published\\": \\"2016-05-02\\"
        },
        \\"path\\": \\"/blog/foo\\"
      }
    ]"
  `)
})
