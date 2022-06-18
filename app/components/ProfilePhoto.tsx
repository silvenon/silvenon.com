import clsx from 'clsx'
import cloudinary from '~/utils/cloudinary'
import { screens } from '../consts'

const ID = 'in-roermond.jpg'
const VERSION = 1
// approxiamte px value of w-40
const SM_WIDTH_PX = 160

interface Props {
  className?: string
}

export default function ProfilePhoto({ className }: Props) {
  return (
    <div
      className={clsx(
        'aspect-w-2 aspect-h-1 sm:aspect-w-4 sm:aspect-h-5',
        className,
      )}
    >
      <picture>
        <source
          media={`(min-width: ${screens.sm})`}
          srcSet={`
            ${cloudinary(ID, {
              version: VERSION,
              transformations: [
                {
                  width: SM_WIDTH_PX,
                  aspectRatio: '4:5',
                  crop: 'fill',
                  gravity: 'face',
                  format: 'auto',
                  quality: 'auto',
                },
              ],
            })} ${SM_WIDTH_PX}w,
            ${cloudinary(ID, {
              version: VERSION,
              transformations: [
                {
                  width: SM_WIDTH_PX * 2,
                  aspectRatio: '4:5',
                  crop: 'fill',
                  gravity: 'face',
                  format: 'auto',
                  quality: 'auto',
                },
              ],
            })} ${SM_WIDTH_PX * 2}w
          `}
          sizes={`${SM_WIDTH_PX}px`}
        />
        <img
          alt=""
          className="absolute block h-full w-full rounded object-cover"
          src={cloudinary(ID, {
            version: VERSION,
            transformations: [
              {
                width: 450,
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
                  width: 450,
                  aspectRatio: '2:1',
                  crop: 'fill',
                  gravity: 'face',
                  format: 'auto',
                  quality: 'auto',
                },
              ],
            })} 450w,
            ${cloudinary(ID, {
              version: VERSION,
              transformations: [
                {
                  width: 900,
                  aspectRatio: '2:1',
                  crop: 'fill',
                  gravity: 'face',
                  format: 'auto',
                  quality: 'auto',
                },
              ],
            })} 900w
          `}
          sizes="100vw"
        />
      </picture>
    </div>
  )
}
