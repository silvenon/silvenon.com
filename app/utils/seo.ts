import type { V2_MetaDescriptor } from '@remix-run/node'
import cloudinary from '~/utils/cloudinary'
import type { Gravity } from '~/utils/cloudinary'

interface Options {
  type: 'website' | 'article'
  title: string
  description?: string
  image?: {
    publicId: string
    alt: string
    version: number
    gravity: Gravity
  }
}

export function getMeta({
  type,
  title,
  description,
  image,
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
    ...(image
      ? [
          // https://developers.facebook.com/docs/sharing/best-practices/#images
          {
            property: 'og:image:url',
            content: cloudinary(image.publicId, {
              version: image.version,
              width: 1080,
              aspectRatio: '1:1',
              crop: 'fill',
              gravity: image.gravity,
              quality: 'auto',
            }),
          },
          { property: 'og:image:type', content: 'image/jpeg' },
          { property: 'og:image:width', content: '1080' },
          { property: 'og:image:height', content: '1080' },
          // https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary
          {
            name: 'twitter:image',
            content: cloudinary(image.publicId, {
              version: image.version,
              width: 3024,
              aspectRatio: '1:1',
              crop: 'fill',
              gravity: image.gravity,
              format: 'webp',
              quality: 'auto',
            }),
          },
          { name: 'twitter:image:alt', content: image.alt },
        ]
      : []),
  ]
}
