import React, { useRef, useEffect } from 'react'
import classNames from 'classnames'
import getDisplayName from '../lib/get-display-name'

const typeset = <C extends React.ElementType>(WrappedComponent: C) => {
  type Props = React.ComponentPropsWithoutRef<C>
  type Element = React.ElementRef<C>
  type TypesetProps = Props & {
    forwardedRef: React.Ref<Element>
  }

  const Typeset = ({
    className,
    children,
    forwardedRef,
    ...props
  }: TypesetProps) => {
    const [typesetClassName, setTypesetClassName] = React.useState('')
    const contentRef = useRef<HTMLSpanElement>(null)

    // after contentRef is updated
    React.useEffect(() => {
      const textContent = contentRef.current?.textContent
      if (typeof textContent === 'string') {
        setTypesetClassName(
          classNames({
            'hanging-single-quotes': textContent.startsWith('‘'),
            'hanging-double-quotes': textContent.startsWith('“'),
          }),
        )
      }
    }, [children])

    return (
      // @ts-ignore: not sure why this fails
      <WrappedComponent
        {...props}
        ref={forwardedRef}
        className={classNames(className, typesetClassName)}
      >
        <span ref={contentRef}>{children}</span>
      </WrappedComponent>
    )
  }

  const forwardRefFn = (props: Props, ref: React.Ref<Element>) => (
    <Typeset {...props} forwardedRef={ref} />
  )

  forwardRefFn.displayName = `typeset(${getDisplayName(WrappedComponent)})`

  return React.forwardRef(forwardRefFn)
}

export default typeset
