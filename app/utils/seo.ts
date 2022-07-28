import type { HtmlMetaDescriptor } from '@remix-run/react'

interface Options {
  type?: 'website' | 'article'
  title: string
  description?: string
}

export function getMeta({
  type = 'website',
  title,
  description,
}: Options): HtmlMetaDescriptor {
  if (description && process.env.NODE_ENV === 'development') {
    if (description.length < 110) {
      throw new Error(
        `Page description should be at least 110 characters long, currently it's ${description.length}.\n\n"${description}"`,
      )
    }
    if (description.length > 160) {
      throw new Error(
        `Page description should be at most 160 characters long, currently it's ${description.length}.\n\n"${description}"`,
      )
    }
  }
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
