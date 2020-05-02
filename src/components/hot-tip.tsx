import React from 'react'
import styled from 'styled-components'
import { setLightness } from 'polished'
import { bleed } from '../styles/mixins'

const Container = styled.section`
  ${bleed};
  margin-bottom: var(--spacing);
  padding: 1rem;
  background: ${(props) => setLightness(0.9, props.theme.color.blue)};
  > * {
    margin-bottom: calc(var(--spacing) / 2) !important;

    &:last-child {
      margin-bottom: 0 !important;
    }
  }
`

const Title = styled.h1`
  position: relative;
  display: inline-block;
  margin-bottom: calc(var(--spacing) / 3);
  margin-left: -1rem;
  padding: 0 calc(1rem);
  color: #fff;
  background: ${(props) => props.theme.color.blue};
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`

type Props = React.ComponentPropsWithoutRef<'section'>

const HotTip = ({ className, children, ...props }: Props) => {
  return (
    <Container {...props} className={className}>
      <Title>Hot tip!</Title>
      {children}
    </Container>
  )
}

export default HotTip
