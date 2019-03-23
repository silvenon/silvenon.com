// @flow
import React, { type ElementType } from 'react'
import classNames from 'classnames'
import getDisplayName from '../utils/get-display-name'

type ClassName = string | { [className: string]: boolean } | false | void | null

type Props = {
  className: ?string,
}

const withClassNames = (...classes: Array<ClassName | ClassName[]>) => {
  const enhance = (WrappedComponent: ElementType) => {
    const ComponentWithClassNames = ({ className, ...props }: Props) => (
      <WrappedComponent
        className={classNames(...classes, className)}
        {...props}
      />
    )
    ComponentWithClassNames.defaultProps = {
      className: null,
    }
    ComponentWithClassNames.displayName = `withClassNames(${getDisplayName(
      WrappedComponent,
    )})`
    return ComponentWithClassNames
  }
  return enhance
}

export default withClassNames
