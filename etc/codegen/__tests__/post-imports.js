const { Volume, createFsFromVolume } = require('memfs')
const dedent = require('dedent')
const { POSTS_DIR } = require('../../../etc/consts')

afterEach(() => {
  jest.resetModules()
})

describe('codegenPostImports', () => {
  it('ignores extras', async () => {
    const vol = Volume.fromJSON(
      {
        'with-extras/index.mdx': dedent`
          ---
          published: 2018-05-12
          ---

          # Foo
        `,
        'with-extras/index.module.scss': '',
        'with-extras/component.tsx': '',
      },
      POSTS_DIR,
    )

    jest.doMock('fs', () => createFsFromVolume(vol))
    const codegenPostImports = require('../post-imports')

    const code = codegenPostImports({
      fromDir: 'src/pages',
    })

    expect(code).toMatchInlineSnapshot(`
      "import * as WithExtras from './blog/with-extras.mdx'

      posts = [
        WithExtras
      ]"
    `)
  })

  it('orders import statements from last post to first', async () => {
    const vol = Volume.fromJSON(
      {
        'foo.mdx': dedent`
          ---
          published: 2018-05-12
          ---

          # Foo
        `,
        'bar.mdx': dedent`
          ---
          published: 2020-02-03
          ---

          # Bar
        `,
        'baz.mdx': dedent`
          ---
          published: 2019-10-15
          ---

          # Baz
        `,
      },
      POSTS_DIR,
    )

    jest.doMock('fs', () => createFsFromVolume(vol))
    const codegenPostImports = require('../post-imports')

    const code = codegenPostImports({
      fromDir: 'src/pages',
      limit: 1,
    })

    expect(code).toMatchInlineSnapshot(`
      "import * as Bar from './blog/bar.mdx'

      posts = [
        Bar
      ]"
    `)
  })

  test('can filter out sequels', async () => {
    const vol = Volume.fromJSON(
      {
        'series/foo.mdx': dedent`
          ---
          published: 2020-01-02
          ---

          # Foo
        `,
        'series/bar.mdx': dedent`
          ---
          seriesPart: 0
          published: 2020-02-03
          ---

          # Bar
        `,
        'series/baz.mdx': dedent`
          ---
          seriesPart: 1
          published: 2020-02-05
          ---

          # Baz
        `,
      },
      POSTS_DIR,
    )

    jest.doMock('fs', () => createFsFromVolume(vol))
    const codegenPostImports = require('../post-imports')

    const code = codegenPostImports({
      fromDir: 'src/pages',
      noSequels: true,
    })

    expect(code).toMatchInlineSnapshot(`
      "import * as SeriesBar from './blog/series/bar.mdx'
      import * as SeriesFoo from './blog/series/foo.mdx'

      posts = [
        SeriesBar,
        SeriesFoo
      ]"
    `)
  })
})
