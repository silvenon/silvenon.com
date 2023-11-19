export function getDomainUrl(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  if (!host) {
    throw new Error('Could not determine domain URL.')
  }
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

// "silvenon.com/" -> "silvenon.com/" (home remains the same)
// "silvenon.com/blog/post/" -> "silvenon.com/blog/post"
// "silvenon.com/blog/post/?query=param" -> "silvenon.com/blog/post?query=param"
export function removeTrailingSlash(href: string): string {
  const url = new URL(href)
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    url.pathname = url.pathname.slice(0, -1)
  }
  return url.href
}
