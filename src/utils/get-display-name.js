// @flow
import { type ElementType } from 'react'

const getDisplayName = (WrappedComponent: ElementType): string =>
  typeof WrappedComponent === 'string'
    ? WrappedComponent
    : WrappedComponent.displayName || WrappedComponent.name || 'Component'

export default getDisplayName
