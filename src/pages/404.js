// @flow
import * as React from 'react'
import styled from 'react-emotion'
import Layout from '../components/layout'
import Container from '../components/container'
import WithLogoBase from '../components/with-logo'
import { H1 as Title, P } from '../components/body'
import BackLink from '../components/back-link'
import { NotificationIcon } from '../components/icons'

const Header = styled.header`
  text-align: center;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0 2rem;
`
const Icon = styled(NotificationIcon)`
  width: 96px;
  height: 96px;
  fill: ${props => props.theme.colors.red};
`

const WithLogo = styled(WithLogoBase)``

const NotFoundPage = () => (
  <Layout
    title="Page Not Found"
    description="This page no longer exists, but the content probably exists elsewhere on this site."
  >
    <Container>
      <Header>
        <WithLogo>
          <BackLink to="/blog">Blog</BackLink>
        </WithLogo>
        <Title>Page Not Found</Title>
      </Header>
      <IconContainer>
        <Icon />
      </IconContainer>
      <P>
        This page no longer exists. It's likely that you got here by following a
        link to my blog post which no longer has that URL. You should be able to
        find the content you're looking for elsewhere on this site.
      </P>
    </Container>
  </Layout>
)

export default NotFoundPage
