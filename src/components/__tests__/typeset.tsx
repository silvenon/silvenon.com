import React from 'react'
import { render } from '@testing-library/react'
import typeset from '../typeset'

describe('typeset() HOC', () => {
  it('renders without crashing', () => {
    const Component = typeset('div')
    render(<Component>Typeset</Component>)
  })

  describe('ref forwarding', () => {
    it('supports React.createRef()', () => {
      const Component = typeset<'div'>('div')
      const container = React.createRef<HTMLDivElement>()
      render(<Component ref={container}>Typeset</Component>)
      expect(container.current).toBeTruthy()
    })

    it('supports callbacks', () => {
      const Component = typeset<'div'>('div')
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
    const { getByTestId } = render(
      <Component data-testid="typeset" className="test">
        “Double quotes”
      </Component>,
    )
    const element = getByTestId('typeset')
    const className = element.getAttribute('class')
    expect(className).toContain('test')
  })

  describe('hanging punctuation', () => {
    test('single quotes', () => {
      const Component = typeset('div')
      const { getByTestId } = render(
        <Component data-testid="typeset">‘Single quotes’</Component>,
      )
      const element = getByTestId('typeset')
      const className = element.getAttribute('class')
      expect(className).toMatchInlineSnapshot(`"hanging-single-quotes"`)
    })

    test('double quotes', () => {
      const Component = typeset('div')
      const { getByTestId } = render(
        <Component data-testid="typeset">“Double quotes”</Component>,
      )
      const element = getByTestId('typeset')
      const className = element.getAttribute('class')
      expect(className).toMatchInlineSnapshot(`"hanging-double-quotes"`)
    })
  })
})
