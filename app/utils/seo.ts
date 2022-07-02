import type { HtmlMetaDescriptor } from '@remix-run/react'

interface Options {
  type?: 'website' | 'article'
  title: string
  description: string
}

export function getMeta({
  type = 'website',
  title,
  description,
}: Options): HtmlMetaDescriptor {
  return {
    'og:type': type,
    title,
    'og:title': title,
    'twitter:title': title,
    description,
    'og:description': description,
    'twitter:description': description,
  }
}
