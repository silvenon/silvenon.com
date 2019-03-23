// @flow
import React, {
  useState,
  useRef,
  useImperativeHandle,
  useEffect,
  type ComponentType,
  type Node,
} from 'react'
import classNames from 'classnames'
import getDisplayName from '../utils/get-display-name'
import { customSelectors } from '../styles/globals.module.css'

function getClassName(customSelector: string): string {
  return customSelectors[customSelector].slice(1)
}

function typeset(WrappedComponent: string): ComponentType<*> {
  type Props = {
    className: ?string,
    children: Node,
  }

  const Typeset = React.forwardRef(function Typeset(
    { className, children, ...props }: Props,
    ref,
  ) {
    const [typesetClassName, setTypesetClassName] = useState('')
    const typesetEl = useRef(null)

    useImperativeHandle(ref, () => typesetEl.current)
    useEffect(() => {
      if (typesetEl.current != null) {
        const { textContent } = typesetEl.current
        setTypesetClassName(
          classNames({
            [getClassName(':--hanging-single-quotes')]: textContent.startsWith(
              '‘',
            ),
            [getClassName(':--hanging-double-quotes')]: textContent.startsWith(
              '“',
            ),
          }),
        )
      }
    }, [children])

    return (
      <WrappedComponent
        ref={typesetEl}
        className={classNames(className, typesetClassName)}
        {...props}
      >
        {children}
      </WrappedComponent>
    )
  })

  Typeset.displayName = `Typeset(${getDisplayName(WrappedComponent)})`

  return Typeset
}

export default typeset
