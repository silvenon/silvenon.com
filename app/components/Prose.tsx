import clsx from 'clsx'
import type { JSX } from 'react'

interface Props
  extends Pick<
    React.HTMLAttributes<HTMLDivElement>,
    'id' | 'className' | 'style' | 'children'
  > {
  as?: keyof JSX.IntrinsicElements
}

export default function Prose({ as: Component = 'div', ...props }: Props) {
  return (
    <Component
      {...props}
      className={clsx(
        props.className,
        'px-page',
        'prose prose-sm prose-zinc dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto',
        'prose-a:text-purple-700 prose-a:hover:text-amber-600',
        'prose-figure:text-center',
        'prose-code:before:hidden prose-code:after:hidden', // getting rid of the semi-parsed Markdown look
        'prose-p:first-of-type:before:hidden prose-p:last-of-type:after:hidden', // getting rid of some styling in blockquotes
        'dark:prose-a:text-purple-300 dark:prose-a:hover:text-amber-400',
        'print:max-w-[90ch] print:px-0',
      )}
    />
  )
}
