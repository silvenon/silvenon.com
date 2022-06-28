import clsx from 'clsx'

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
        'prose prose-sm prose-zinc mx-auto dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl',
        'prose-a:text-purple-700 hover:prose-a:text-amber-600',
        'prose-figure:text-center',
        'before:prose-code:hidden after:prose-code:hidden', // getting rid of the semi-parsed Markdown look
        'before:prose-p:first-of-type:hidden after:prose-p:last-of-type:hidden', // getting rid of some styling in blockquotes
        'prose-code:rounded-lg prose-code:bg-code-background prose-code:px-2 prose-code:py-1 prose-code:font-normal prose-code:text-code-foreground',
        'prose-pre:bg-code-background prose-pre:px-0 prose-pre:leading-loose prose-pre:text-code-foreground',
        'dark:prose-a:text-purple-300 dark:hover:prose-a:text-amber-400',
        'dark:prose-code:border-gray-800 dark:prose-code:bg-code-background-dark dark:prose-code:text-code-foreground-dark',
        'dark:prose-pre:bg-code-background-dark dark:prose-pre:text-code-foreground-dark',
      )}
    />
  )
}
