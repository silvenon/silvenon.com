// @flow
import * as React from 'react'
import styled from 'react-emotion'

// https://css-tricks.com/aspect-ratio-boxes

const Container = styled.div`
  max-width: 100vw;
  ${props => props.theme.mqMin.lg} {
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
  <Container css={{ width }}>
    <Inner
      css={{ paddingTop: `${(parseFloat(height) / parseFloat(width)) * 100}%` }}
    >
      {children}
    </Inner>
  </Container>
)

export default IntrinsicRatio
