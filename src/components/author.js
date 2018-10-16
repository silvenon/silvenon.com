// @flow
import * as React from 'react'
import styled, { css } from 'astroturf'
import { darken } from 'polished'
import Container from './container'
import { H2, A } from './body'
import cl from '../utils/cloudinary'
import { customMedia } from '../styles/imports'

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

const breakpoint = '--min-medium'

const Wrapper = styled.section`
  margin: 2rem 0 3rem;
  background: color(#fff shade(10%));
  font-family: var(--base-font-family);
  text-align: center;
  @media (${breakpoint}) {
    text-align: left;
  }
`

const FlexContainer = styled(Container)`
  @media (${breakpoint}) {
    display: flex;
    align-items: stretch;
  }
`

const Avatar = styled.img`
  box-sizing: content-box;
  width: 128px;
  height: 128px;
  border-radius: 0 0 0.5rem 0.5rem;
  @media (${breakpoint}) {
    width: 256px;
    height: 256px;
    margin: 0 1rem 0 0;
    border-radius: 0;
  }
`

const contentStyles = css`
  .with-links {
    padding-top: 1rem;
    padding-bottom: 2.5rem;
  }
  .without-links {
    padding-top: 1rem;
    padding-bottom: 1.5rem;
    @media (${breakpoint}) {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`

const Name = (props: *) => <H2 as="h1" {...props} />
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
  @media (${breakpoint}) {
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
  background: var(--color);
  color: #fff;
  line-height: 0;
  &:hover,
  &:focus {
    background: var(--color-hover);
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
        sizes={`${customMedia[breakpoint]} 256px, 128px`}
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
      <Content
        className={
          Object.keys(links).length > 0
            ? contentStyles.withLinks
            : contentStyles.withoutLinks
        }
      >
        <Name>{name}</Name>
        <Biography>
          <p>{biography}</p>
        </Biography>
        <SocialContainer>
          {Object.keys(links).map(key => {
            const { name, url, color, Icon } = links[key]
            return (
              <SocialLink
                key={key}
                title={name}
                href={url}
                style={{
                  '--color': color,
                  '--color-hover': darken(0.15, color),
                }}
              >
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
