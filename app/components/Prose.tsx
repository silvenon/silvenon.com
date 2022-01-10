import clsx from 'clsx'

interface Props {
  as?: keyof JSX.IntrinsicElements
  id?: string
  className?: string
  children: React.ReactNode
}

export default function Prose({
  as: Component = 'div',
  id,
  className,
  children,
}: Props) {
  return (
    <Component
      id={id}
      className={clsx(
        className,
        'prose mx-auto prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert',
      )}
    >
      {children}
    </Component>
  )
}
