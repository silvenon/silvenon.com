import React from 'react'
import Media from 'react-media'
import styled from 'react-emotion/macro'
import { boxShadow } from '../styles'
import { BREAKPOINT } from '../constants'

const BORDER_RADIUS = 1

const Container = styled('a')`
  display: flex;
  align-items: center;
  padding: 0 2rem 0 1rem;
  border: 0.5rem solid #fff;
  border-radius: ${BORDER_RADIUS}rem;
  background: ${props => props.color};
  ${boxShadow};
  color: #fff;
  text-decoration: none;
  @media (min-width: ${BREAKPOINT}) {
    flex-direction: column;
    justify-content: center;
    width: 10rem;
    padding: 0;
    transition:
      background 0.2s,
      color 0.2s;
    &:hover, &:focus {
      background: #fff;
      color: ${props => props.color};
    }
  }
`

const Label = styled('span')`
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  @media (Min-width: ${BREAKPOINT}) {
    align-self: stretch;
    display: block;
    margin: 0;
    padding: 0.5rem 0;
    border-top: 0.25rem solid ${props => props.color};
    background: #fff;
    color: ${props => props.color};
  }
`

const IconContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}rem;
  height: ${props => props.size}rem;
  @media (min-width: ${BREAKPOINT}) {
    margin: 0.5rem;
  }
`

const IconBase = styled('svg')`
  width: ${props => props.size}rem;
  height: ${props => props.size}rem;
  margin-right: 1rem;
  @media (min-width: ${BREAKPOINT}) {
    margin-right: 0;
  }
`

const CardIconLink = ({ label, icon, ...props }) => {
  const Icon = IconBase.withComponent(icon.Component)
  return (
    <Media query={{ minWidth: BREAKPOINT }}>
      {matches => matches ? (
        <Container {...props}>
          <IconContainer size={props.size}>
            <Icon size={icon.size} />
          </IconContainer>
          <Label color={props.color}>
            {label}
          </Label>
        </Container>
      ) : (
        <Container {...props}>
          <IconContainer size={props.size}>
            <Icon size={icon.size} />
          </IconContainer>
          <Label>{label}</Label>
        </Container>
      )}
    </Media>
  )
}

export { CardIconLink }
