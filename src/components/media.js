// @flow
import React, { type Node } from 'react'
import { Tweet as ReactTweet } from 'react-twitter-widgets'
import IntrinsicRatio from './intrinsic-ratio'
import ResponsiveImage from './responsive-image'
import withClassNames from './with-class-names'
import { DPRS } from '../constants/responsive'
import styles from './media.module.css'

export const Figure = 'figure'

type MediaProps = {
  fullWidth: boolean,
  rounded: boolean,
  width: string | number,
  height: string | number,
  children: Node,
}
const Media = ({ fullWidth, rounded, width, height, children }: MediaProps) => (
  <div className={styles.media}>
    {fullWidth ? (
      <div
        className={rounded ? styles.innerRounded : styles.inner}
        style={{
          width: '100%',
          height: parseFloat(height),
        }}
      >
        {children}
      </div>
    ) : (
      <div className={rounded ? styles.innerRounded : styles.inner}>
        <IntrinsicRatio width={width} height={height}>
          {children}
        </IntrinsicRatio>
      </div>
    )}
  </div>
)
Media.defaultProps = {
  fullWidth: false,
}

type ImageProps = {
  rounded: boolean,
  srcId: string,
  originalWidth: string | number,
  originalHeight: string | number,
  dprs: number[],
}
export const Image = ({
  rounded,
  originalWidth,
  originalHeight,
  ...props
}: ImageProps) => {
  const maxDpr = Math.max(...props.dprs)
  return (
    <Media
      rounded={rounded}
      width={parseFloat(originalWidth) / maxDpr}
      height={parseFloat(originalHeight) / maxDpr}
    >
      <ResponsiveImage originalWidth={originalWidth} {...props} />
    </Media>
  )
}
Image.defaultProps = {
  rounded: true,
  dprs: DPRS,
}

type IframeProps = {
  rounded: boolean,
  width: string | number,
  height: string | number,
}
export const Iframe = ({ rounded, ...props }: IframeProps) => (
  <Media
    fullWidth={typeof props.width === 'string' && props.width.includes('%')}
    rounded={rounded}
    width={props.width}
    height={props.height}
  >
    {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
    <iframe {...props} style={{ height: '100%' }} />
  </Media>
)
Iframe.defaultProps = {
  rounded: true,
}

export const Caption = withClassNames(styles.caption)('figcaption')

export const Tweet = ({ className, ...props }: { className: ?string }) => (
  <div className={styles.tweet}>
    <ReactTweet {...props} />
  </div>
)
Tweet.defaultProps = {
  className: null,
}
