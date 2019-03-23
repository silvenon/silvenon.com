// @flow
import * as React from 'react'
import classNames from 'classnames'
import getDisplayName from '../utils/get-display-name'
import { customSelectors } from '../styles/globals.module.css'

const typeset = (WrappedComponent: string): React.ComponentType<*> => {
  type Props = {
    forwardedRef: React.Ref<typeof WrappedComponent>,
    className: ?string,
  }

  type State = {
    classNames: { [className: string]: boolean },
  }

  class Typeset extends React.Component<Props, State> {
    static defaultProps = {
      className: null,
    }

    state = {
      classNames: {},
    }

    container: null | React.ElementRef<typeof WrappedComponent> = null

    refContainer = node => {
      const { forwardedRef } = this.props
      if (forwardedRef != null && typeof forwardedRef !== 'string') {
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef.current === null) {
          forwardedRef.current = node
        }
      }
      this.container = node
    }

    componentDidMount() {
      if (this.container != null) {
        const { textContent } = this.container
        const hangingSingleQuotes = customSelectors[
          ':--hanging-single-quotes'
        ].slice(1)
        const hangingDoubleQuotes = customSelectors[
          ':--hanging-double-quotes'
        ].slice(1)
        this.setState({
          classNames: {
            [hangingSingleQuotes]: textContent.startsWith('‘'),
            [hangingDoubleQuotes]: textContent.startsWith('“'),
          },
        })
      }
    }

    render() {
      const { forwardedRef, className, ...props } = this.props

      return (
        <WrappedComponent
          ref={this.refContainer}
          className={classNames(className, this.state.classNames)}
          {...props}
        />
      )
    }
  }

  Typeset.displayName = `Typeset(${getDisplayName(WrappedComponent)})`

  // $FlowFixMe
  return React.forwardRef((props: *, ref: *) => (
    <Typeset forwardedRef={ref} {...props} />
  ))
}

export default typeset
