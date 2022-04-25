// @vitest-environment jsdom
import { render } from '@testing-library/react'
import ProseImage from '../ProseImage'

describe('ProseImage', () => {
  it('has correct output', () => {
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
})
