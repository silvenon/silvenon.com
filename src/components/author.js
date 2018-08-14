// @flow
import * as React from 'react'
import styled, { css } from 'react-emotion'
import { darken } from 'polished'
import Container from './container'
import { H2, A } from './body'
import theme from '../styles/theme'
import cl from '../utils/cloudinary'

type Props = {
  inColor: boolean,
  name: string,
  avatar: {
    id: string,
    aspectRatio: number,
  },
  biography: string,
  links: {
    [network: string]: {
      name: string,
      url: string,
      color: string,
      Icon: string,
    },
  },
}

const breakpoint = 'md'

const Wrapper = styled.section`
  margin: 2rem 0 3rem;
  background: ${darken(0.1, '#fff')};
  font-family: ${props => props.theme.fontFamily.base};
  text-align: center;
  ${props => props.theme.mqMin[breakpoint]} {
    text-align: left;
  }
`

const FlexContainer = styled(Container)`
  ${props => props.theme.mqMin[breakpoint]} {
    display: flex;
    align-items: stretch;
  }
`

const Avatar = styled.img`
  box-sizing: content-box;
  width: 128px;
  height: 128px;
  border-radius: 0 0 0.5rem 0.5rem;
  ${props => props.theme.mqMin[breakpoint]} {
    width: 256px;
    height: 256px;
    margin: 0 1rem 0 0;
    border-radius: 0;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  ${props =>
    props.hasLinks
      ? css`
          padding-top: 1rem;
          padding-bottom: 2.5rem;
        `
      : css`
          padding-top: 1rem;
          padding-bottom: 1.5rem;
          ${props.theme.mqMin[breakpoint]} {
            padding-top: 0;
            padding-bottom: 0;
          }
        `};
`

const Name = H2.withComponent('h1')
const Biography = styled.div`
  font-style: italic;
`

const SocialContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  ${props => props.theme.mqMin[breakpoint]} {
    left: auto;
    transform: translate(0%, 50%);
  }
`
const SocialLink = styled(A)`
  display: block;
  margin-right: 0.5rem;
  padding: 0.5rem;
  border: 0.25rem solid #fff;
  border-radius: 50%;
  background: ${props => props.color};
  color: #fff;
  line-height: 0;
  &:hover,
  &:focus {
    background: ${props => darken(0.15, props.color)};
    color: #fff;
    text-decoration: none;
  }
`

const Author = ({
  inColor,
  name,
  avatar,
  biography,
  links,
  ...props
}: Props) => (
  <Wrapper {...props}>
    <FlexContainer>
      <Avatar
        alt="avatar"
        sizes={`(min-width: ${theme.screenWidth[breakpoint]}px) 256px, 128px`}
        srcSet={[128, 256, 512]
          .map(
            size =>
              `${cl.url(avatar.id, {
                width: size,
                crop: 'scale',
                effect: inColor ? null : 'grayscale',
              })} ${size}w`,
          )
          .join(', ')}
        src={cl.url(avatar.id, {
          width: 256,
          crop: 'scale',
          effect: inColor ? null : 'grayscale',
        })}
      />
      <Content hasLinks={Object.keys(links).length > 0}>
        <Name>{name}</Name>
        <Biography>
          <p>{biography}</p>
        </Biography>
        <SocialContainer>
          {Object.keys(links).map(key => {
            const { name, url, color, Icon } = links[key]
            return (
              <SocialLink key={key} title={name} href={url} color={color}>
                <Icon size={28} />
              </SocialLink>
            )
          })}
        </SocialContainer>
      </Content>
    </FlexContainer>
  </Wrapper>
)

Author.defaultProps = {
  inColor: false,
  links: {},
}

export default Author
