// @flow
import * as React from 'react'
import styled from 'astroturf'

// https://css-tricks.com/aspect-ratio-boxes

const Container = styled.div`
  max-width: 100vw;
  @media (--min-large) {
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
  width: string | number,
  height: string | number,
  children: React.Node,
}

const IntrinsicRatio = ({ width, height, children }: Props) => (
  <Container style={{ width }}>
    <Inner
      style={{
        paddingTop: `${(parseFloat(height) / parseFloat(width)) * 100}%`,
      }}
    >
      {children}
    </Inner>
  </Container>
)

export default IntrinsicRatio
