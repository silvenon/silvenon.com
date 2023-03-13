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

// "silvenon.com/" -> "silvenon.com/"
// "silvenon.com/blog/post/" -> "silvenon.com/blog/post"
export function removeTrailingSlash(request: Request) {
  const url = new URL(request.url)
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    throw redirect(url.pathname.slice(0, -1) + url.search, { status: 308 })
  }
}

export function getCanonicalUrl(request: Request) {
  const origin = getDomainUrl(request)
  const { pathname, search } = new URL(request.url)
  return `${origin}${pathname}${search}`
}
