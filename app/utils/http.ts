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
export function removeTrailingSlash(href: string) {
  const url = new URL(href)
  if (url.pathname === '/') return url.href
  if (!url.pathname.endsWith('/')) return url.href
  return new URL(url.pathname.slice(0, -1), url.origin).href + url.search
}

export function getCanonicalUrl(request: Request) {
  const origin = getDomainUrl(request)
  const { pathname, search } = new URL(request.url)
  return removeTrailingSlash(`${origin}${pathname}${search}`)
}
