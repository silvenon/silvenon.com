import type CSS from 'csstype'
import cloudinary from '../utils/cloudinary'
import clsx from 'clsx'

// approximate px values of @tailwindcss/typography's 65ch on different viewports
const proseMaxWidth = {
  sm: '620px',
  lg: '700px',
  xl: '780px',
  '2xl': '920px',
}
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
  cloudinaryId: string
}

export default function ProseImage({
  width,
  height,
  cloudinaryId,
  ...props
}: Props) {
  const maxWidth = width < largestImageSize ? width / 2 : undefined

  return (
    <div className="not-prose mx-auto" style={{ maxWidth }}>
      {/* biome-ignore lint/a11y/useAltText: alt is passed through props */}
      <img
        {...props}
        className={clsx(
          props.className,
          'aspect-[var(--width)/var(--height)] w-full rounded-lg',
        )}
        style={{
          '--width': width,
          '--height': height,
        }}
        loading="lazy"
        src={getImageUrl(cloudinaryId, 1024)}
        srcSet={imageSizes
          .filter((size) => size < width)
          .concat(width)
          .map((size) => `${getImageUrl(cloudinaryId, size)} ${size}w`)
          .join(', ')}
        sizes={[
          `(min-width: ${import.meta.env.SCREEN_2XL}) ${proseMaxWidth['2xl']}`,
          `(min-width: ${import.meta.env.SCREEN_XL}) ${proseMaxWidth.xl}`,
          `(min-width: ${import.meta.env.SCREEN_LG}) ${proseMaxWidth.lg}`,
          `(min-width: ${import.meta.env.SCREEN_SM}) ${proseMaxWidth.sm}`,
          `calc(100vw - (var(--page-padding) * 2))`,
        ].join(', ')}
      />
    </div>
  )
}

declare module 'react' {
  interface CSSProperties extends CSS.Properties<string | number> {
    '--width'?: number
    '--height'?: number
  }
}
