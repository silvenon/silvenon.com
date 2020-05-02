import React from 'react'
import styled, { css } from 'styled-components'

// https://css-tricks.com/aspect-ratio-boxes

const Container = styled.div`
  max-width: 100vw;
  @media ${(props) => props.theme.query.lg} {
    max-width: 100%;
  }
`

const Inner = styled.div`
  position: relative;
  height: 0;

  img,
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

type Props = {
  className?: string
  width: string | number
  height: string | number
  children?: React.ReactNode
}

const IntrinsicRatio = ({ className, width, height, children }: Props) => {
  const normalized = {
    width: typeof width === 'string' ? parseFloat(width) : width,
    height: typeof height === 'string' ? parseFloat(height) : height,
  }
  return (
    <Container
      className={className}
      css={css`
        width: ${typeof width === 'number' ? `${width}px` : width};
      `}
    >
      <Inner
        css={css`
          padding-top: ${(normalized.height / normalized.width) * 100}%;
        `}
      >
        {children}
      </Inner>
    </Container>
  )
}

export default IntrinsicRatio
