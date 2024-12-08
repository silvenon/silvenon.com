import { redirect, data } from 'react-router'
import { getRedirects } from '~/.server/redirects'
import type { Route } from './+types/catchall'

export async function catchall({ request }: { request: Request }) {
  const { pathname } = new URL(request.url)

  // redirect posts before simplifying paths
  if (pathname.startsWith('/blog/posts/')) {
    throw redirect(pathname.replace(new RegExp(`^/blog/posts/`), '/blog/'), 301)
  }

  if (
    // blog categories which are not being used at the moment
    pathname.startsWith('/blog/category/') ||
    // I only have posts in English
    pathname.startsWith('/blog/language/') ||
    // no more pagination
    pathname.startsWith('/blog/page/')
  ) {
    throw redirect('/', 302)
  }

  const redirects = await getRedirects()

  for (const { source, destination, permanent } of redirects) {
    if (source === pathname) {
      throw redirect(destination, permanent ? 301 : 302)
    }
  }

  throw data(
    pathname.startsWith('/blog/') ? 'Post not found' : 'Page not found',
    { status: 404 },
  )
}

export async function loader({ request }: Route.LoaderArgs) {
  throw await catchall({ request })
}

export default function Catchall() {
  return null
}
