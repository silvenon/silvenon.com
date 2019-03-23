// @flow
import React from 'react'
import Layout from '../components/layout'
import Container from '../components/container'
import Header from '../components/header'
import { H1 as Title, P } from '../components/body'
import BackLink from '../components/back-link'
import { NotificationIcon } from '../components/icons'
import styles from './404.module.css'

type Props = {
  location: {
    pathname: string,
  },
}

const NotFoundPage = ({ location: { pathname } }: Props) => (
  <Layout
    title="Page Not Found"
    description="This page no longer exists, but the content probably exists elsewhere on this site."
    pathname={pathname}
  >
    <Header>
      <Header.TopBar>
        <BackLink to="/blog">Blog</BackLink>
      </Header.TopBar>
      <Title>Page Not Found</Title>
    </Header>
    <Container>
      <div className={styles.iconContainer}>
        <NotificationIcon className={styles.icon} />
      </div>
      <P>
        This page no longer exists. It's likely that you got here by following a
        link to my blog post which no longer has that URL. You should be able to
        find the content you're looking for elsewhere on this site.
      </P>
    </Container>
  </Layout>
)

export default NotFoundPage
