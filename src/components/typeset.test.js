// @flow
import React from 'react'
import { render } from '@testing-library/react'
import typeset from './typeset'

jest.mock('../styles/globals.module.css', () => ({
  customSelectors: {
    ':--hanging-single-quotes': '.hanging-single-quotes',
    ':--hanging-double-quotes': '.hanging-double-quotes',
  },
}))

describe('typeset() HOC', () => {
  it('renders without crashing', () => {
    const Component = typeset('div')
    render(<Component>Typeset</Component>)
  })

  describe('ref forwarding', () => {
    it('supports React.createRef()', () => {
      const Component = typeset('div')
      const container = React.createRef()
      render(<Component ref={container}>Typeset</Component>)
      expect(container.current).toBeTruthy()
    })

    it('supports callbacks', () => {
      const Component = typeset('div')
      let container = null
      render(
        <Component
          ref={(node) => {
            container = node
          }}
        >
          Typeset
        </Component>,
      )
      expect(container).toBeTruthy()
    })
  })

  it('preserves existing classes', () => {
    const Component = typeset('div')
    const { container } = render(
      <Component className="test">“Double quotes”</Component>,
    )
    // $FlowFixMe
    const className: string = container.firstChild.getAttribute('class')
    expect(className).toContain('test')
  })

  describe('hanging punctuation', () => {
    test('single quotes', () => {
      const Component = typeset('div')
      const { container } = render(<Component>‘Single quotes’</Component>)
      // $FlowFixMe
      const className: string = container.firstChild.getAttribute('class')
      expect(className).toMatchInlineSnapshot(`"hanging-single-quotes"`)
    })

    test('double quotes', () => {
      const Component = typeset('div')
      const { container } = render(<Component>“Double quotes”</Component>)
      // $FlowFixMe
      const className: string = container.firstChild.getAttribute('class')
      expect(className).toMatchInlineSnapshot(`"hanging-double-quotes"`)
    })
  })
})
