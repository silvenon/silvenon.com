import React from 'react'
import cloudinary, { ImageTransform } from '../cloudinary'
import { screens } from '../consts'

interface Props {
  className?: string
}

export default function ProfilePhoto({ className }: Props) {
  const id = 'in-reactor-1.jpg'
  const version = 3
  // approxiamte px value of w-40
  const smWidthPx = 160
  // simulate zoom because I don't know any alternative
  const zoom: ImageTransform = {
    aspectRatio: '1:1',
    crop: 'fill',
    gravity: 'custom',
  }
  return (
    <div className={className}>
      <picture>
        <source
          media={`(min-width: ${screens.sm})`}
          srcSet={`
          ${cloudinary(id, {
            version,
            transformations: [
              zoom,
              {
                width: smWidthPx,
                aspectRatio: '4:5',
                crop: 'fill',
                gravity: 'custom',
              },
            ],
          })} ${smWidthPx}w,
          ${cloudinary(id, {
            version,
            transformations: [
              zoom,
              {
                width: smWidthPx * 2,
                aspectRatio: '4:5',
                crop: 'fill',
                gravity: 'custom',
              },
            ],
          })} ${smWidthPx * 2}w
        `}
          sizes={`${smWidthPx}px`}
        />
        <img
          alt=""
          className="block absolute w-full h-full object-cover rounded"
          src={cloudinary(id, {
            version,
            transformations: [
              zoom,
              { width: 450, aspectRatio: '3:2', crop: 'fill', gravity: 'auto' },
            ],
          })}
          srcSet={`
          ${cloudinary(id, {
            version,
            transformations: [
              zoom,
              { width: 450, aspectRatio: '3:2', crop: 'fill', gravity: 'face' },
            ],
          })} 450w,
          ${cloudinary(id, {
            version,
            transformations: [
              zoom,
              { width: 900, aspectRatio: '3:2', crop: 'fill', gravity: 'face' },
            ],
          })} 900w
        `}
          sizes="100vw"
        />
      </picture>
    </div>
  )
}
