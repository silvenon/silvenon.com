import { redirect } from 'remix'

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
    throw redirect(request.url.slice(0, -1), {
      status: 308,
    })
  }
}
