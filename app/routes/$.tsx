import { redirect } from 'remix'
import type { LoaderFunction } from 'remix'
// remix can't import "fs/promises" outside of *.server.ts files
import fs from 'fs'
import toml from 'toml'

export const loader: LoaderFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)

  // redirect posts before simplifying paths
  if (pathname.startsWith('/blog/posts/')) {
    return redirect(
      pathname.replace(new RegExp(`^/blog/posts/`), '/blog/'),
      301,
    )
  }

  if (
    // blog categories which are not being used at the moment
    pathname.startsWith('/blog/category/') ||
    // I only have posts in English
    pathname.startsWith('/blog/language/') ||
    // no more pagination
    pathname.startsWith('/blog/page/')
  ) {
    return redirect('/', 302)
  }

  const { redirects } = toml.parse(
    await fs.promises.readFile(`${__dirname}/../app/redirects.toml`, 'utf8'),
  ) as {
    redirects: Array<{
      source: string
      destination: string
      permanent?: boolean
    }>
    rewrites: Array<{
      source: string
      destination: string
    }>
  }

  for (const { source, destination, permanent } of redirects) {
    if (source === pathname) {
      return redirect(destination, permanent ? 301 : 302)
    }
  }

  throw new Response('Not Found', { status: 404 })
}

export default function Catchall() {
  return null
}
