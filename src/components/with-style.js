// @flow
import React, { type ElementType } from 'react'
import getDisplayName from '../utils/get-display-name'

type Style = {}

type Props = {
  style: Style,
}

const withClassNames = (initialStyle: Style) => {
  const enhance = (WrappedComponent: ElementType) => {
    const ComponentWithStyle = ({ style, ...props }: Props) => (
      <WrappedComponent
        style={{
          ...initialStyle,
          ...style,
        }}
        {...props}
      />
    )
    ComponentWithStyle.defaultProps = {
      style: {},
    }
    ComponentWithStyle.displayName = `withStyle(${getDisplayName(
      WrappedComponent,
    )})`
    return ComponentWithStyle
  }
  return enhance
}

export default withClassNames
