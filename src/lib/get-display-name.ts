import React from 'react'

const getDisplayName = (WrappedComponent: React.ElementType): string =>
  typeof WrappedComponent === 'string'
    ? WrappedComponent
    : WrappedComponent.displayName || WrappedComponent.name || 'Component'

export default getDisplayName
