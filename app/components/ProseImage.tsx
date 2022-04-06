import CSS from 'csstype'
import cloudinary from '../utils/cloudinary'
import { screens } from '../consts'
import clsx from 'clsx'

// approximate px values of @tailwindcss/typography's 65ch on different viewports
const proseMaxWidth = {
  sm: '620px',
  lg: '700px',
  xl: '780px',
  '2xl': '920px',
}
const proseSizes: Array<keyof typeof proseMaxWidth> = ['sm', 'lg', 'xl', '2xl']
const imageSizes = [640, 768, 1024, 1536, 2048]
const largestImageSize = Math.max(...imageSizes)

export function getImageUrl(id: string, size: number) {
  return cloudinary(id, {
    crop: 'limit',
    width: size,
    format: 'auto',
    quality: 'auto',
  })
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

export default function ProseImage({
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
      <div className="not-prose mx-auto" style={{ maxWidth }}>
        <div
          className="aspect-ratio"
          style={{
            '--width': width,
            '--height': height,
          }}
        >
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
            sizes={[
              ...proseSizes.map(
                (size) =>
                  `(min-width: ${screens[size]}) ${proseMaxWidth[size]}`,
              ),
              `calc(100vw - (var(--content-padding) * 2))`,
            ].join(', ')}
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
    '--width'?: number
    '--height'?: number
  }
}
