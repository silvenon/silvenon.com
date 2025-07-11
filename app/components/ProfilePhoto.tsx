import clsx from 'clsx'
import cloudinary from '~/utils/cloudinary'

const ID = 'in-roermond.jpg'
const VERSION = 1

interface Props {
  className?: string
}

export default function ProfilePhoto({ className }: Props) {
  return (
    <picture>
      <source
        media={`(min-width: ${import.meta.env.SCREEN_SM})`}
        srcSet={`
            ${cloudinary(ID, {
              version: VERSION,
              transformations: [
                {
                  width: 160,
                  aspectRatio: '4:5',
                  crop: 'fill',
                  gravity: 'face',
                  format: 'auto',
                  quality: 'auto',
                },
              ],
            })} ${160}w,
            ${cloudinary(ID, {
              version: VERSION,
              transformations: [
                {
                  width: 160 * 2,
                  aspectRatio: '4:5',
                  crop: 'fill',
                  gravity: 'face',
                  format: 'auto',
                  quality: 'auto',
                },
              ],
            })} ${260 * 2}w
          `}
        sizes={`${160}px`}
      />
      <img
        alt=""
        className={clsx(
          'aspect-2/1 w-full rounded-sm object-cover sm:aspect-4/5',
          className,
        )}
        src={cloudinary(ID, {
          version: VERSION,
          transformations: [
            {
              width: 360,
              aspectRatio: '2:1',
              crop: 'fill',
              gravity: 'face',
              format: 'auto',
              quality: 'auto',
            },
          ],
        })}
        srcSet={`
            ${cloudinary(ID, {
              version: VERSION,
              transformations: [
                {
                  width: 360,
                  aspectRatio: '2:1',
                  crop: 'fill',
                  gravity: 'face',
                  format: 'auto',
                  quality: 'auto',
                },
              ],
            })}${360}w,
            ${cloudinary(ID, {
              version: VERSION,
              transformations: [
                {
                  width: 360 * 2,
                  aspectRatio: '2:1',
                  crop: 'fill',
                  gravity: 'face',
                  format: 'auto',
                  quality: 'auto',
                },
              ],
            })} ${360 * 2}w
          `}
        sizes={[
          `(min-width: ${import.meta.env.SCREEN_SM}) 160px`,
          'min(360px, calc(100vw - var(--spacing-page) * 2 - 0.75rem * 2))',
        ].join(', ')}
      />
    </picture>
  )
}
