import React from 'react'
import styled, { css } from 'styled-components'
import { shade, darken } from 'polished'
import { keys, toPairs } from 'lodash'
import Container from './container'
import { H2, A } from './body'
import LazyImage from './lazy-image'
import Icon from './icon'
import cl from '../lib/cloudinary'
import { siteConfig, socialLinks } from '../lib/consts'

const { name, avatar, biography } = siteConfig

const authorQuery = '(min-width: 768px)'

const Wrapper = styled.section`
  margin: 2rem 0 3rem;
  background: ${shade(0.9, '#fff')};
  font-family: var(--base-font-family);
  text-align: center;
  @media ${authorQuery} {
    text-align: left;
  }
`

const Inner = styled.div`
  @media ${authorQuery} {
    display: flex;
    align-items: stretch;
  }
`

const Avatar = styled.img`
  box-sizing: content-box;
  width: 128px;
  height: 128px;
  border-radius: 0 0 0.5rem 0.5rem;
  @media ${authorQuery} {
    width: 256px;
    height: 256px;
    margin: 0 1rem 0 0;
    border-radius: 0;
  }
`

const Content = styled.div<{ hasLinks: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  ${(props) =>
    props.hasLinks
      ? css`
          padding-top: 1rem;
          padding-bottom: 2.5rem;
        `
      : css`
          padding-top: 1rem;
          padding-bottom: 1.5rem;
          @media ${authorQuery} {
            padding-top: 0;
            padding-bottom: 0;
          }
        `}
`

const Biography = styled.div`
  font-style: italic;
  font-size: 0.85rem;
`

const SocialContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  @media ${authorQuery} {
    left: auto;
    transform: translate(0%, 50%);
  }
`

const SocialLink = styled(A)<{ color: string }>`
  display: block;
  margin-right: 0.5rem;
  padding: 0.5rem;
  border: 0.25rem solid #fff;
  border-radius: 50%;
  background: ${(props) => props.color};
  color: #fff;
  line-height: 0;
  &:hover,
  &:focus {
    background: ${(props) => darken(0.15, props.color)};
    color: #fff;
    text-decoration: none;
  }
`

type Props = {
  inColor?: boolean
  hasLinks?: boolean
  lazy?: boolean
  className?: string
}

const Author = ({
  inColor = false,
  hasLinks = true,
  lazy = true,
  ...props
}: Props) => {
  return (
    <Wrapper {...props}>
      <Container>
        <Inner>
          <Avatar
            alt="avatar"
            as={lazy ? LazyImage : 'img'}
            sizes="(min-width: 768px) 256px, 128px"
            srcSet={[128, 256, 512]
              .map(
                (size) =>
                  `${cl.url(avatar.id, {
                    width: size,
                    crop: 'scale',
                    effect: inColor ? undefined : 'grayscale',
                  })} ${size}w`,
              )
              .join(', ')}
            src={cl.url(avatar.id, {
              width: 256,
              crop: 'scale',
              effect: inColor ? undefined : 'grayscale',
            })}
          />
          <Content hasLinks={hasLinks}>
            <H2 as="h1">{name}</H2>
            <Biography>
              <p>{biography.long}</p>
            </Biography>
            {hasLinks && (
              <SocialContainer>
                {toPairs(socialLinks).map(([network, link]) => {
                  const { name, url, color, iconId } = link
                  return (
                    <SocialLink
                      key={network}
                      title={name}
                      href={url}
                      color={color}
                    >
                      <Icon id={iconId} size={28} />
                    </SocialLink>
                  )
                })}
              </SocialContainer>
            )}
          </Content>
        </Inner>
      </Container>
    </Wrapper>
  )
}

export default Author
