// @flow
import * as React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import styled from 'react-emotion'
import { lighten } from 'polished'
import { shuffle } from 'lodash'
import { Share as TwitterShare } from 'react-twitter-widgets'
import { FaUser, FaCalendarAlt } from 'react-icons/fa'
import { DiscussionEmbed } from 'disqus-react'
import Layout from './layout'
import Spacer from './spacer'
import Container from './container'
import Header from './header'
import WithLogo from './with-logo'
import { H1 } from './body'
import Link from './link'
import BackLink from './back-link'
import BaseMeta from './meta'
import Date from './date'
import Author from './author'
import socialLinks from '../constants/social-links'

const Meta = styled(BaseMeta)`
  margin: 0.5rem 1rem 1rem;
  display: inline-block;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 0.5rem;
  }
`

const Title = styled(H1)`
  margin-bottom: 0;
  color: #000;
`

const TwitterShareContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  line-height: 0;
`

const NextPost = styled.p`
  margin-bottom: 2rem;
  font-family: ${props => props.theme.fontFamily.alt};
  color: ${lighten(0.5, '#000')};
`

type ReadNext = {
  title: string,
  path: string,
}

type Props = {
  children: React.Node,
  pageContext: {
    node: {
      fields: {
        date: string,
        path: string,
        slug: string,
      },
      exports: {
        meta: {
          title: string,
          lang: string,
          lastModified: string,
        },
      },
      excerpt: string,
    },
    readNextSuggestions: ReadNext[],
  },
}

type State = {
  readNext: ?ReadNext,
}

class Post extends React.Component<Props, State> {
  state = {
    readNext: null,
  }

  componentDidMount() {
    const {
      pageContext: { readNextSuggestions },
    } = this.props
    this.setState({
      readNext: shuffle(readNextSuggestions)[0],
    })
  }

  render() {
    const {
      children,
      pageContext: {
        node: {
          fields: { date, path, slug },
          exports: {
            meta: { title, lang, lastModified },
          },
          excerpt,
        },
      },
    } = this.props
    const { readNext } = this.state
    return (
      <StaticQuery
        query={graphql`
          query PostQuery {
            site {
              siteMetadata {
                siteUrl
                name
                avatar {
                  id
                  aspectRatio
                }
                biography {
                  long
                }
              }
            }
          }
        `}
        render={({
          site: {
            siteMetadata: { siteUrl, name, avatar, biography },
          },
        }: {
          site: {
            siteMetadata: {
              siteUrl: string,
              name: string,
              avatar: { id: string, aspectRatio: number },
              biography: { long: string },
            },
          },
        }) => (
          <Layout
            title={title}
            description={excerpt}
            lang={lang}
            article={{
              publishedTime: date,
              modifiedTime: lastModified !== '' ? lastModified : null,
              author: name,
              tags: [],
            }}
          >
            <Header>
              <WithLogo>
                <BackLink to="/blog">All posts</BackLink>
              </WithLogo>
              <Title>{title}</Title>
              <Meta>
                <MetaRow>
                  <FaUser />
                  <div>{name}</div>
                </MetaRow>
                <MetaRow>
                  <FaCalendarAlt />
                  <Date dateTime={date} />
                </MetaRow>
              </Meta>
            </Header>
            <Container>
              {children}
              <TwitterShareContainer>
                <TwitterShare
                  url={`${siteUrl}${path}`}
                  options={{ text: title, via: 'silvenon', size: 'large' }}
                />
              </TwitterShareContainer>
            </Container>
            <Author
              name={name}
              avatar={avatar}
              biography={biography.long}
              links={socialLinks}
            />
            <Container>
              {readNext != null ? (
                <NextPost>
                  <span>Read next → </span>
                  <Link to={readNext.path}>{readNext.title}</Link>
                </NextPost>
              ) : null}
              <DiscussionEmbed
                shortname="silvenon"
                config={{
                  url: `${siteUrl}${path}`,
                  identifier: slug,
                  title,
                }}
              />
            </Container>
            <Spacer />
          </Layout>
        )}
      />
    )
  }
}

export default Post
