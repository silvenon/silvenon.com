/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import ProseImage from '../ProseImage'

describe('ProseImage', () => {
  test('plain', () => {
    const { container } = render(
      <ProseImage
        alt="description"
        src="/hello-world.jpg"
        width={500}
        height={300}
      />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('Cloudinary', () => {
    const { container } = render(
      <ProseImage
        alt="description"
        cloudinaryId="1_zs1MOwXPd-FcxoQ5RIMvyw_t3axyl"
        width={800}
        height={600}
      />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('Unsplash', () => {
    const { container } = render(
      <ProseImage
        alt="description"
        src="/hello-world.jpg"
        width={800}
        height={600}
        unsplash={{
          name: 'Matija Marohnić',
          username: 'silvenon',
        }}
      />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('Cloudinary + Unsplash', () => {
    const { container } = render(
      <ProseImage
        alt="description"
        cloudinaryId="1_zs1MOwXPd-FcxoQ5RIMvyw_t3axyl"
        width={800}
        height={600}
        unsplash={{
          name: 'Matija Marohnić',
          username: 'silvenon',
        }}
      />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
