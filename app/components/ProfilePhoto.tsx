import cloudinary from '~/utils/cloudinary'
import type { ImageTransform } from '~/utils/cloudinary'
import { screens } from '../consts'

const ID = 'in-reactor-1.jpg'
const VERSION = 3
// approxiamte px value of w-40
const SM_WIDTH_PX = 160
// simulate zoom because I don't know any alternative
const zoom: ImageTransform = {
  aspectRatio: '1:1',
  crop: 'fill',
  gravity: 'custom',
}

interface Props {
  className?: string
}

export default function ProfilePhoto({ className }: Props) {
  return (
    <div className={className}>
      <picture>
        <source
          media={`(min-width: ${screens.sm})`}
          srcSet={`
          ${cloudinary(ID, {
            version: VERSION,
            transformations: [
              zoom,
              {
                width: SM_WIDTH_PX,
                aspectRatio: '4:5',
                crop: 'fill',
                gravity: 'custom',
                format: 'auto',
                quality: 'auto',
              },
            ],
          })} ${SM_WIDTH_PX}w,
          ${cloudinary(ID, {
            version: VERSION,
            transformations: [
              zoom,
              {
                width: SM_WIDTH_PX * 2,
                aspectRatio: '4:5',
                crop: 'fill',
                gravity: 'custom',
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
              zoom,
              {
                width: 450,
                aspectRatio: '4:2',
                crop: 'fill',
                gravity: 'auto',
                format: 'auto',
                quality: 'auto',
              },
            ],
          })}
          srcSet={`
          ${cloudinary(ID, {
            version: VERSION,
            transformations: [
              zoom,
              {
                width: 450,
                aspectRatio: '4:2',
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
              zoom,
              {
                width: 900,
                aspectRatio: '4:2',
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
