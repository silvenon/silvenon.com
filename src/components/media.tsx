import React from 'react'
import { Tweet as ReactTweet } from 'react-twitter-widgets'
import styled, { css } from 'styled-components'
import { tint } from 'polished'
import IntrinsicRatio from './intrinsic-ratio'
import ResponsiveImage from './responsive-image'
import { DPRS } from '../lib/consts'

export const Figure = 'figure'

type MediaProps = {
  rounded: boolean
  width: string | number
  height: string | number
  children?: React.ReactNode
}
const Media = ({ rounded, width, height, children }: MediaProps) => (
  <div
    css={css`
      margin: 0 calc(var(--site-padding) * -1);
      margin-bottom: var(--spacing);
      overflow: hidden;
      @media ${(props) => props.theme.query.lg} {
        margin-left: auto;
        margin-right: auto;
        ${rounded &&
        css`
          border-radius: var(--border-radius);
        `}
      }

      img,
      iframe {
        display: block;
      }
    `}
  >
    {typeof width === 'string' && width.endsWith('%') ? (
      children
    ) : (
      <IntrinsicRatio
        width={width}
        height={height}
        css={css`
          margin-left: auto;
          margin-right: auto;
        `}
      >
        {children}
      </IntrinsicRatio>
    )}
  </div>
)

type ImageProps = React.ComponentPropsWithoutRef<typeof ResponsiveImage> & {
  rounded?: boolean
  srcId: string
  originalWidth: string | number
  originalHeight: string | number
  dprs?: number[]
}
export const Image = ({
  alt,
  rounded = true,
  originalWidth,
  originalHeight,
  dprs = DPRS,
  ...props
}: ImageProps) => {
  const maxDpr = Math.max(...dprs)
  const normalized = {
    originalWidth:
      typeof originalWidth === 'string'
        ? parseFloat(originalWidth)
        : originalWidth,
    originalHeight:
      typeof originalHeight === 'string'
        ? parseFloat(originalHeight)
        : originalHeight,
  }
  return (
    <Media
      rounded={rounded}
      width={normalized.originalWidth / maxDpr}
      height={normalized.originalHeight / maxDpr}
    >
      <ResponsiveImage alt={alt} {...props} originalWidth={originalWidth} />
    </Media>
  )
}

type IframeProps = React.IframeHTMLAttributes<HTMLIFrameElement> & {
  title: string
  rounded?: boolean
  width: string | number
  height: string | number
}
export const Iframe = ({ rounded = true, title, ...props }: IframeProps) => (
  <Media rounded={rounded} width={props.width} height={props.height}>
    <iframe title={title} {...props} />
  </Media>
)

export const Caption = styled.figcaption`
  max-width: 36rem;
  margin: -0.5rem auto;
  margin-bottom: var(--spacing);
  text-align: center;
  font-size: 0.75rem;
  font-style: italic;
  color: ${tint(0.5, '#000')};
`

type TweetProps = React.ComponentPropsWithoutRef<typeof ReactTweet>
export const Tweet = (props: TweetProps) => (
  <div
    css={css`
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacing);

      // responsive
      twitter-widget {
        max-width: 500px !important;
        width: auto !important;
      }
    `}
  >
    <ReactTweet {...props} />
  </div>
)
