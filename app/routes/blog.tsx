import { Outlet, useCatch } from '@remix-run/react'
import Prose from '~/components/Prose'
import NotFound from '~/components/NotFound'

export default function PostLayout() {
  return (
    <div className="px-4">
      <Outlet />
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <Prose as="main" className="py-4 text-center">
      {caught.status === 404 ? (
        <NotFound title="Post Not Found">
          <p>
            It&apos;s likely that you got here by following a link to one of my
            blog posts which no longer has that URL. You should be able to find
            the content you&apos;re looking for elsewhere on this site, unless I
            deleted that post!{' '}
            <span role="img" aria-label="embarrassed">
              😳
            </span>
          </p>
        </NotFound>
      ) : (
        <h1>
          <span className="text-amber-600">{caught.status}</span>{' '}
          {caught.statusText}
        </h1>
      )}
    </Prose>
  )
}
