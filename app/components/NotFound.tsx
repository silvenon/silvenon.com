import Prose from './Prose'

interface Props {
  title: string
  children: React.ReactNode
}

export default function NotFound({ title, children }: Props) {
  return (
    <Prose as="main" className="py-4 text-center">
      <h1 className="mb-0">{title}</h1>
      <div className="my-6 flex justify-center sm:my-7 lg:my-8 xl:my-9 2xl:my-10">
        <svg
          className="w-14 h-14 fill-current text-amber-600"
          role="presentation"
        >
          <use href="/icons.svg#exclamation-mark" />
        </svg>
      </div>
      {children}
    </Prose>
  )
}
