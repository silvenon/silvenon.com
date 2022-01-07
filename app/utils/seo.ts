import { HtmlMetaDescriptor } from '@remix-run/react'

interface Options {
  title: string
  description: string
  pathname?: string
}

export function getMeta({ title, description }: Options): HtmlMetaDescriptor {
  return {
    title,
    'og:title': title,
    'twitter:title': title,
    description,
    'og:description': description,
    'twitter:description': description,
  }
}
