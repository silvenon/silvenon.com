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
        'prose prose-sm sm:prose lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-dark sm:dark:prose-dark',
      )}
    >
      {children}
    </Component>
  )
}
