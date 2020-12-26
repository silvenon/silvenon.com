const unified = require('unified')
const parse = require('rehype-parse')
const cloudinary = require('../rehype-cloudinary')
const stringify = require('rehype-stringify')
const dedent = require('dedent')

jest.mock('../image-size', () => async () => ({
  width: 800,
  height: 600,
}))

const processor = unified()
  .use(parse, { fragment: true })
  .use(cloudinary)
  .use(stringify)

describe('rehype-cloudinary', () => {
  test('output', async () => {
    const result = await processor.process(dedent`
      <img alt="description" data-cloudinary-id="my-image">
    `)
    const template = document.createElement('template')
    template.innerHTML = result.contents
    expect(template.content.firstChild).toMatchInlineSnapshot(`
      <div
        class="ar"
        style="--w: 800; --h: 600; max-width: 400px;"
      >
        <div
          class="ar-media"
        >
          <img
            alt="description"
            loading="lazy"
            sizes="(min-width: 1536px) 952.91px, (min-width: 1280px) 811.865px, (min-width: 1024px) 735.82px, (min-width: 640px) 655.078px, calc(100vw - 2rem)"
            src="https://res.cloudinary.com/silvenon/image/upload/c_limit/my-image"
            srcset="https://res.cloudinary.com/silvenon/image/upload/c_limit,w_640/my-image 640w, https://res.cloudinary.com/silvenon/image/upload/c_limit,w_768/my-image 768w"
          />
        </div>
      </div>
    `)
  })
})
