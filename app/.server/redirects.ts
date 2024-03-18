import toml from 'toml'
import redirectsContent from './redirects.toml?raw'

export async function getRedirects() {
  const { redirects } = toml.parse(redirectsContent) as {
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

  return redirects
}
