// @flow
import React from 'react'
import { render } from 'react-testing-library'
import ResponsiveImage from './responsive-image'

jest.mock('../styles/globals.module.css', () => ({
  customProperties: {
    '--site-padding': '1rem',
  },
}))

describe('<ResponsiveImage>', () => {
  describe('src', () => {
    it('uses maximum 1x width', () => {
      const { container } = render(
        <ResponsiveImage srcId="myId" originalWidth="600" dprs={[1, 2, 3]} />,
      )
      // $FlowFixMe
      const src = container.querySelector('img').getAttribute('src')
      expect(src).toMatch(/w_200\/myId$/)
    })
  })

  describe('srcset', () => {
    it("skips the first source because it's too small", () => {
      const { container } = render(
        <ResponsiveImage srcId="myId" originalWidth="800" />,
      )
      // $FlowFixMe
      const srcSet = container.querySelector('img').getAttribute('srcset')
      expect(srcSet).not.toContain('w_200/myId 200w')
      expect(srcSet).toContain('w_400/myId 400w')
    })

    test('when original width is less than maximum width', () => {
      const { container } = render(
        <ResponsiveImage
          srcId="myId"
          originalWidth="768"
          containerMaxWidth={992}
          dprs={[1, 2]}
        />,
      )
      // $FlowFixMe
      const srcSet = container.querySelector('img').getAttribute('srcset')
      expect(srcSet).toContain('w_600/myId 600w')
      expect(srcSet).toContain('w_768/myId 768w')
    })

    test('when original width is greater than maximum width', () => {
      const { container } = render(
        <ResponsiveImage
          srcId="myId"
          originalWidth="3200"
          containerMaxWidth={992}
          dprs={[1, 2]}
        />,
      )
      // $FlowFixMe
      const srcSet = container.querySelector('img').getAttribute('srcset')
      expect(srcSet).toContain('w_1800/myId 1800w')
      expect(srcSet).toContain('w_1984/myId 1984w')
    })

    test('dpr-only', () => {
      const { container } = render(
        <ResponsiveImage
          srcId="myId"
          originalWidth="1200"
          dprs={[1, 1.5, 2, 3]}
          onlyDpr
        />,
      )
      // $FlowFixMe
      const srcSet = container.querySelector('img').getAttribute('srcset')
      expect(srcSet).toContain('w_400/myId 1x')
      expect(srcSet).toContain('w_600/myId 1.5x')
      expect(srcSet).toContain('w_800/myId 2x')
      expect(srcSet).toContain('w_1200/myId 3x')
    })
  })

  describe('sizes', () => {
    test('when original width is less than maximum width', () => {
      const { container } = render(
        <ResponsiveImage
          srcId="myId"
          originalWidth="800"
          containerMaxWidth={992}
        />,
      )
      // $FlowFixMe
      const sizes = container.querySelector('img').getAttribute('sizes')
      expect(sizes).toContain('(min-width: 400px) 400px')
    })

    test('when original width is greater than maximum width', () => {
      const { container } = render(
        <ResponsiveImage
          srcId="myId"
          originalWidth="2400"
          containerMaxWidth={992}
        />,
      )
      // $FlowFixMe
      const sizes = container.querySelector('img').getAttribute('sizes')
      expect(sizes).toContain('(min-width: 992px) calc(992px - 1rem * 2)')
    })
  })

  it('rounds widths down', () => {
    const { container } = render(
      <ResponsiveImage srcId="myId" originalWidth="1000" dprs={[1, 2, 3]} />,
    )
    // $FlowFixMe
    const src = container.querySelector('img').getAttribute('src')
    expect(src).toMatch(/w_333\/myId$/)
  })
})
