import { Link } from 'react-router'
import cloudinary from '~/utils/cloudinary'

interface Props {
  status?: number
  title: string
  description?: React.ReactNode
  errorOutput?: React.ReactNode
}

export default function Boundary({
  status,
  title,
  description,
  errorOutput,
}: Props) {
  return (
    <main
      className="relative min-h-full bg-cover bg-position-[top_right_20%]"
      style={{
        backgroundImage: `url("${cloudinary('rain', {
          width: 3050,
          quality: 80,
          crop: 'fit',
          format: 'auto',
        })}")`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-48">
        {status ? (
          <p className="text-sm font-semibold tracking-wide text-white/50 uppercase">
            {status} error
          </p>
        ) : null}
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          // <span> refers to emojis, we don't want don't want to make them transparent
          <div className="mt-2 text-lg font-medium text-white/50 [&_span]:text-white/100">
            {description}
          </div>
        ) : null}
        {errorOutput ? (
          <div className="prose prose-base prose-invert prose-pre:mx-0 prose-pre:px-0 mx-auto mt-4 max-w-none text-left [&_.line]:px-4">
            {errorOutput}
          </div>
        ) : null}
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-transparent bg-white/75 px-4 py-2 text-sm font-medium text-black sm:bg-white/25 sm:text-white/75 sm:hover:bg-white/50 sm:hover:text-white/100"
          >
            Go back home
          </Link>
        </div>
      </div>
      <p className="bottom-page right-page absolute text-white/50">
        Photo by{' '}
        <a
          className="text-white hover:underline"
          href="https://unsplash.com/@navi_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
        >
          Navi
        </a>{' '}
        on{' '}
        <a
          className="text-white hover:underline"
          href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
        >
          Unsplash
        </a>
      </p>
    </main>
  )
}
