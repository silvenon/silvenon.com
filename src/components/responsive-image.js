// @flow
import * as React from 'react'
import { range } from 'lodash'
import { MAX_WIDTH } from './container'
import { DPRS } from './media'
import cl from '../utils/cloudinary'
import { customProperties } from '../styles/globals.css'

const STEP_WIDTH = 200

type Props = {
  srcId: string,
  originalWidth: string | number,
  containerMaxWidth: number,
  dprs: number[],
  onlyDpr: boolean,
}

const ResponsiveImage = ({
  srcId,
  originalWidth,
  containerMaxWidth,
  dprs,
  onlyDpr,
  ...props
}: Props) => {
  const maxDpr = Math.max(...dprs)
  const maxActualWidth = Math.min(
    parseFloat(originalWidth),
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
          .map(dpr => {
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
            .map(i => (i + 1) * STEP_WIDTH)
            .slice(1),
          maxActualWidth,
        ]
          .map(w => {
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
              ? `calc(${maxDisplayWidth}px - ${
                  customProperties['--site-padding']
                } * 2)`
              : `${maxDisplayWidth}px`
          }`,
          '100vw',
        ].join(', '),
      }

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={src} {...respProps} {...props} />
  )
}

ResponsiveImage.defaultProps = {
  containerMaxWidth: MAX_WIDTH,
  dprs: DPRS,
  onlyDpr: false,
}

export default ResponsiveImage
