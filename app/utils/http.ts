import { redirect } from '@remix-run/node'

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  if (!host) {
    throw new Error('Could not determine domain URL.')
  }
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

// "/blog/post/" -> "/blog/post"
export function removeTrailingSlash(request: Request) {
  const url = new URL(request.url)
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    throw redirect(
      new URL(url.pathname.slice(0, -1), url.origin).href + url.search,
      { status: 308 },
    )
  }
}
