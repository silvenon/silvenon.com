// @flow
import * as React from 'react'
import styled from 'react-emotion'
import { lighten } from 'polished'
import { Tweet as ReactTweet } from 'react-twitter-widgets'
import IntrinsicRatio from './intrinsic-ratio'
import ResponsiveImage from './responsive-image'
import theme from '../styles/theme'

export const Figure = styled.figure``

const MediaContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 -${props => props.theme.sitePadding};
  ${props => props.theme.marginBottom};
  ${props => props.theme.mqMin.lg} {
    margin-left: 0;
    margin-right: 0;
  }
`
const MediaWrapper = styled.div`
  ${props => props.theme.mqMin.lg} {
    overflow: hidden;
    border-radius: ${props => (props.rounded ? props.theme.borderRadius : 0)};
  }

  img,
  iframe {
    display: block;
  }
`

type MediaProps = {
  fullWidth: boolean,
  rounded: boolean,
  width: string | number,
  height: string | number,
  children: React.Node,
}
const Media = ({ fullWidth, rounded, width, height, children }: MediaProps) => (
  <MediaContainer>
    {fullWidth ? (
      <MediaWrapper
        rounded={rounded}
        css={{
          width: '100%',
          height,
        }}
      >
        {children}
      </MediaWrapper>
    ) : (
      <MediaWrapper rounded={rounded}>
        <IntrinsicRatio width={width} height={height}>
          {children}
        </IntrinsicRatio>
      </MediaWrapper>
    )}
  </MediaContainer>
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
  dprs: theme.dprs,
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

export const Caption = styled.figcaption`
  max-width: 36rem;
  margin: -0.5rem auto;
  ${props => props.theme.marginBottom};
  text-align: center;
  font-size: 0.75rem;
  font-style: italic;
  color: ${lighten(0.5, '#000')};
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  ${props => props.theme.marginBottom};
`
export const Tweet = (props: *) => (
  <Center>
    <ReactTweet {...props} />
  </Center>
)
