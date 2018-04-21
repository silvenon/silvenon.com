import React from 'react'
import Media from 'react-media'
import styled from 'react-emotion'
import { mqMin } from '../styles/theme'

const Container = styled.a`
  display: flex;
  align-items: center;
  padding: 0 2rem 0 1rem;
  border: 0.5rem solid #fff;
  border-radius: 1rem;
  background: ${props => props.color};
  ${props => props.theme.boxShadow};
  color: #fff;
  &:hover,
  &:focus {
    background: #fff;
    color: ${props => props.color};
    text-decoration: none;
  }
  ${props => props.theme.mqMin.sm} {
    flex-direction: column;
    justify-content: center;
    width: 10rem;
    padding: 0;
    transition: background-color 0.2s, color 0.2s;
    color: ${props => props.color};
  }
`

const Label = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  ${props => props.theme.mqMin.sm} {
    align-self: stretch;
    display: block;
    margin: 0;
    padding: 0.5rem 0;
    border-top: 0.25rem solid ${props => props.color};
    background: #fff;
    color: ${props => props.color};
  }
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}rem;
  height: ${props => props.size}rem;
  ${props => props.theme.mqMin.sm} {
    margin: 0.5rem;
  }
`

const IconBase = styled.svg`
  width: ${props => props.size}rem;
  height: ${props => props.size}rem;
  margin-right: 1rem;
  fill: #fff;
  ${props => props.theme.mqMin.sm} {
    margin-right: 0;
  }
  ${Container}:hover &,
  ${Container}:focus & {
    fill: currentColor;
  }
`

const CardIconLink = ({ label, icon, ...props }) => {
  const Icon = IconBase.withComponent(icon.Component)
  return (
    <Media query={{ minWidth: mqMin.sm }}>
      {matches =>
        matches ? (
          <Container {...props}>
            <IconContainer size={props.size}>
              <Icon size={icon.size} />
            </IconContainer>
            <Label color={props.color}>{label}</Label>
          </Container>
        ) : (
          <Container {...props}>
            <IconContainer size={props.size}>
              <Icon size={icon.size} />
            </IconContainer>
            <Label>{label}</Label>
          </Container>
        )
      }
    </Media>
  )
}

export { CardIconLink }
