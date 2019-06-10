// @flow
import React, { type AbstractComponent } from 'react'
import getDisplayName from '../utils/get-display-name'

type Props = {|
  style: ?{},
|}

function withStyle<Config, Instance>(initialStyle: {}) {
  return function enhance(
    WrappedComponent: string | AbstractComponent<Config, Instance>,
  ): AbstractComponent<{| ...Config, ...Props |}, void> {
    function ComponentWithStyle({
      style,
      ...props
    }: {|
      ...Config,
      ...Props,
    |}) {
      return (
        <WrappedComponent
          style={{
            ...initialStyle,
            ...style,
          }}
          {...props}
        />
      )
    }
    ComponentWithStyle.defaultProps = {
      style: null,
    }
    ComponentWithStyle.displayName = `withStyle(${getDisplayName(
      WrappedComponent,
    )})`
    return ComponentWithStyle
  }
}

export default withStyle
