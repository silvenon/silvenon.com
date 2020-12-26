const { processor } = require('../markdown')
const dedent = require('dedent')

jest.mock('../image-size', () => async () => ({
  width: 800,
  height: 600,
}))

describe('Markdown processor', () => {
  test('output', async () => {
    const result = await processor.process(dedent`
      Introduction to my post with smart -- punctuation.

      ## Section

      <img
        alt=""
        data-cloudinary-id="my-image"
        data-unsplash
        data-name="Matija Marohnić"
        data-username="silvenon">

      ~~~js{2}
      function doSomething() {
        console.log('hello')
      }
      ~~~

      [[tip | Hot tip!]]
      | Content.
      |
      | More content.
    `)
    const template = document.createElement('template')
    template.innerHTML = result.contents
    expect(template.content).toMatchSnapshot()
  })
})
