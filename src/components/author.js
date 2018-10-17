// @flow
import * as React from 'react'
import { darken } from 'polished'
import Container from './container'
import { H2, A } from './body'
import cl from '../utils/cloudinary'
import withClassNames from './with-class-names'
import { customMedia } from '../styles/imports'
import styles from './author.module.css'

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

const Author = ({
  inColor,
  name,
  avatar,
  biography,
  links,
  ...props
}: Props) => (
  <section {...props}>
    <Container className={styles.container}>
      <img
        alt="avatar"
        className={styles.avatar}
        sizes={`${customMedia['--author-breakpoint']} 256px, 128px`}
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
      <div
        className={
          Object.keys(links).length > 0
            ? styles.contentWithLinks
            : styles.contentWithoutLinks
        }
      >
        <H2 as="h1">{name}</H2>
        <div className={styles.biography}>
          <p>{biography}</p>
        </div>
        <div className={styles.socialContainer}>
          {Object.keys(links).map(key => {
            const { name, url, color, Icon } = links[key]
            return (
              <A
                className={styles.socialLink}
                key={key}
                title={name}
                href={url}
                style={{
                  '--color': color,
                  '--color-hover': darken(0.15, color),
                }}
              >
                <Icon size={28} />
              </A>
            )
          })}
        </div>
      </div>
    </Container>
  </section>
)

Author.defaultProps = {
  inColor: false,
  links: {},
}

export default withClassNames(styles.wrapper)(Author)
