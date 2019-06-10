// @flow
import React, { type AbstractComponent } from 'react'
import classNames from 'classnames'
import getDisplayName from '../utils/get-display-name'

type ClassName = string | { [className: string]: boolean } | false | void | null

type Props = {|
  className: ?string,
|}

function withClassNames(...classes: Array<ClassName | ClassName[]>) {
  return function enhance<Config, Instance>(
    WrappedComponent: string | AbstractComponent<Config, Instance>,
  ): AbstractComponent<{| ...Config, ...Props |}, void> {
    function ComponentWithClassNames({
      className,
      ...props
    }: {|
      ...Config,
      ...Props,
    |}) {
      return (
        <WrappedComponent
          className={classNames(...classes, className)}
          {...props}
        />
      )
    }
    ComponentWithClassNames.defaultProps = {
      className: null,
    }
    ComponentWithClassNames.displayName = `withClassNames(${getDisplayName(
      WrappedComponent,
    )})`
    return ComponentWithClassNames
  }
}

export default withClassNames
