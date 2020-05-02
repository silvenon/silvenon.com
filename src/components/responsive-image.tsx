import React from 'react'
import { range } from 'lodash'
import { MAX_WIDTH } from './container'
import cl from '../lib/cloudinary'
import { DPRS } from '../lib/consts'

const STEP_WIDTH = 200

type Props = {
  alt?: string
  srcId: string
  originalWidth: string | number
  containerMaxWidth?: number
  dprs?: number[]
  onlyDpr?: boolean
}

const ResponsiveImage = ({
  alt,
  srcId,
  originalWidth,
  containerMaxWidth = MAX_WIDTH,
  dprs = DPRS,
  onlyDpr = false,
  ...props
}: Props) => {
  const maxDpr = Math.max(...dprs)
  const maxActualWidth = Math.min(
    typeof originalWidth === 'string'
      ? parseFloat(originalWidth)
      : originalWidth,
    containerMaxWidth * maxDpr,
  )
  const maxDisplayWidth = Math.floor(maxActualWidth / maxDpr)

  const src = cl.url(srcId, {
    crop: 'scale',
    width: maxDisplayWidth,
  })
  const respProps = onlyDpr
    ? {
        srcSet: dprs
          .map((dpr) => {
            const url = cl.url(srcId, {
              crop: 'scale',
              width: maxDisplayWidth * dpr,
            })
            return `${url} ${dpr}x`
          })
          .join(', '),
      }
    : {
        srcSet: [
          ...range(Math.floor(maxActualWidth / STEP_WIDTH))
            .map((i) => (i + 1) * STEP_WIDTH)
            .slice(1),
          maxActualWidth,
        ]
          .map((w) => {
            const width = Math.floor(w)
            const url = cl.url(srcId, {
              crop: 'scale',
              width,
            })
            return `${url} ${width}w`
          })
          .join(', '),
        sizes: [
          `(min-width: ${maxDisplayWidth}px) ${
            maxDisplayWidth === containerMaxWidth
              ? `calc(${maxDisplayWidth}px - var(--site-padding) * 2)`
              : `${maxDisplayWidth}px`
          }`,
          '100vw',
        ].join(', '),
      }

  return <img {...props} {...respProps} alt={alt} src={src} />
}

export default ResponsiveImage
