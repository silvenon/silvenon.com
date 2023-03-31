import type { V2_MetaDescriptor } from '@remix-run/node'

interface Options {
  type?: 'website' | 'article'
  title: string
  description?: string
}

export function getMeta({
  type = 'website',
  title,
  description,
}: Options): V2_MetaDescriptor[] {
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
  return [
    { property: 'og:type', content: type },
    { title },
    { property: 'og:title', content: title },
    { name: 'twitter:title', content: title },
    ...(description
      ? [
          { name: 'description', content: description },
          { property: 'og:description', content: description },
          { name: 'twitter:description', content: description },
        ]
      : []),
  ]
}
