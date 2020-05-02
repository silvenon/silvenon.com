import React from 'react'
import { render } from '@testing-library/react'
import ResponsiveImage from '../responsive-image'

describe('<ResponsiveImage>', () => {
  describe('src', () => {
    it('uses maximum 1x width', () => {
      const { getByRole } = render(
        <ResponsiveImage
          alt="test"
          srcId="myId"
          originalWidth="600"
          dprs={[1, 2, 3]}
        />,
      )
      const img = getByRole('img')
      const src = img.getAttribute('src')
      expect(src).toMatch(/w_200.*myId$/)
    })
  })

  describe('srcset', () => {
    it("skips the first source because it's too small", () => {
      const { getByRole } = render(
        <ResponsiveImage alt="test" srcId="myId" originalWidth="800" />,
      )
      const img = getByRole('img')
      const srcSet = img.getAttribute('srcset')
      expect(srcSet).not.toMatch(/w_200.*myId 200w/)
      expect(srcSet).toMatch(/w_400.*myId 400w/)
    })

    test('when original width is less than maximum width', () => {
      const { getByRole } = render(
        <ResponsiveImage
          alt="test"
          srcId="myId"
          originalWidth="768"
          containerMaxWidth={992}
          dprs={[1, 2]}
        />,
      )
      const img = getByRole('img')
      const srcSet = img.getAttribute('srcset')
      expect(srcSet).toMatch(/w_600.*myId 600w/)
      expect(srcSet).toMatch(/w_768.*myId 768w/)
    })

    test('when original width is greater than maximum width', () => {
      const { getByRole } = render(
        <ResponsiveImage
          alt="test"
          srcId="myId"
          originalWidth="3200"
          containerMaxWidth={992}
          dprs={[1, 2]}
        />,
      )
      const img = getByRole('img')
      const srcSet = img.getAttribute('srcset')
      expect(srcSet).toMatch(/w_1800.*myId 1800w/)
      expect(srcSet).toMatch(/w_1984.*myId 1984w/)
    })

    test('dpr-only', () => {
      const { getByRole } = render(
        <ResponsiveImage
          alt="test"
          srcId="myId"
          originalWidth="1200"
          dprs={[1, 1.5, 2, 3]}
          onlyDpr
        />,
      )
      const img = getByRole('img')
      const srcSet = img.getAttribute('srcset')
      expect(srcSet).toMatch(/w_400.*myId 1x/)
      expect(srcSet).toMatch(/w_600.*myId 1\.5x/)
      expect(srcSet).toMatch(/w_800.*myId 2x/)
      expect(srcSet).toMatch(/w_1200.*myId 3x/)
    })
  })

  describe('sizes', () => {
    test('when original width is less than maximum width', () => {
      const { getByRole } = render(
        <ResponsiveImage
          alt="test"
          srcId="myId"
          originalWidth="800"
          containerMaxWidth={992}
        />,
      )
      const img = getByRole('img')
      const sizes = img.getAttribute('sizes')
      expect(sizes).toContain('(min-width: 400px) 400px')
    })

    test('when original width is greater than maximum width', () => {
      const { getByRole } = render(
        <ResponsiveImage
          alt="test"
          srcId="myId"
          originalWidth="2400"
          containerMaxWidth={992}
        />,
      )
      const img = getByRole('img')
      const sizes = img.getAttribute('sizes')
      expect(sizes).toContain(
        '(min-width: 992px) calc(992px - var(--site-padding) * 2)',
      )
    })
  })

  it('rounds widths down', () => {
    const { getByRole } = render(
      <ResponsiveImage
        alt="test"
        srcId="myId"
        originalWidth="1000"
        dprs={[1, 2, 3]}
      />,
    )
    const img = getByRole('img')
    const src = img.getAttribute('src')
    expect(src).toMatch(/w_333.*myId$/)
  })
})
