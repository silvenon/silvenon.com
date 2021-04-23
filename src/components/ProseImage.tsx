import React from 'react'
import CSS from 'csstype'
import cl from '../cloudinary'
import { screens } from '../consts'
import clsx from 'clsx'
import spacing from '../spacing.module.css'

// approximate px values of @tailwindcss/typography's 65ch on different viewports
const proseMaxWidth = {
  sm: '660px',
  lg: '740px',
  xl: '820px',
  '2xl': '1000px',
}
const proseSizes: Array<keyof typeof proseMaxWidth> = ['sm', 'lg', 'xl', '2xl']
const imageSizes = [640, 768, 1024, 1536, 2048]
const largestImageSize = Math.max(...imageSizes)

export function getImageUrl(id: string, size: number) {
  return cl(id, { crop: 'limit', width: size })
}

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  width: number
  height: number
  cloudinaryId?: string
  unsplash?: {
    name: string
    username: string
  }
}

export default function Image({
  width,
  height,
  cloudinaryId,
  unsplash,
  ...props
}: Props) {
  const maxWidth = width < largestImageSize ? width / 2 : undefined
  const imgProps = { ...props, className: clsx(props.className, 'rounded-lg') }

  // eslint-disable-next-line jsx-a11y/alt-text
  let el = <img {...imgProps} />

  if (typeof cloudinaryId !== 'undefined') {
    el = (
      <div
        className="ar mx-auto"
        style={{
          '--w': width,
          '--h': height,
          maxWidth,
        }}
      >
        <div className="ar-media">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            {...imgProps}
            loading="lazy"
            src={getImageUrl(cloudinaryId, 1024)}
            srcSet={imageSizes
              .filter((size) => size < width)
              .concat(width)
              .map((size) => `${getImageUrl(cloudinaryId, size)} ${size}w`)
              .join(', ')}
            sizes={proseSizes
              .map(
                (size) =>
                  `(min-width: ${screens[size]}) ${proseMaxWidth[size]}`,
              )
              .concat(`calc(100vw - (${spacing.contentPadding} * 2))`)
              .join(', ')}
          />
        </div>
      </div>
    )
  }

  if (typeof unsplash !== 'undefined') {
    el = (
      <figure>
        {el}
        <figcaption>
          Photo by{' '}
          <a
            href={`https://unsplash.com/@${unsplash.username}?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText`}
          >
            {unsplash.username}
          </a>{' '}
          on{' '}
          <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
            Unsplash
          </a>
        </figcaption>
      </figure>
    )
  }

  return el
}

declare module 'react' {
  interface CSSProperties extends CSS.Properties<string | number> {
    '--w'?: number
    '--h'?: number
  }
}
