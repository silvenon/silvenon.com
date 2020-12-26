const unified = require('unified')
const parse = require('rehype-parse')
const unsplash = require('../rehype-unsplash')
const stringify = require('rehype-stringify')
const dedent = require('dedent')

const processor = unified()
  .use(parse, { fragment: true })
  .use(unsplash)
  .use(stringify)

describe('rehype-unsplash', () => {
  it('adds attribution', async () => {
    const result = await processor.process(
      dedent`
        <img
          alt=""
          src="/my-image"
          data-unsplash
          data-name="Matija Marohnić"
          data-username="silvenon"
        >
      `,
    )
    const template = document.createElement('template')
    template.innerHTML = result.contents
    expect(template.content.firstChild).toMatchInlineSnapshot(`
      <figure>
        <img
          alt=""
          src="/my-image"
        />
        <figcaption>
          <span>
            Photo by 
          </span>
          <a
            href="https://unsplash.com/@silvenon?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
          >
            Matija Marohnić
          </a>
          <span>
             on 
          </span>
          <a
            href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
          >
            Unsplash
          </a>
        </figcaption>
      </figure>
    `)
  })
})
