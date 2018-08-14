// @flow
import * as React from 'react'
import styled, { css } from 'react-emotion'
import MetaBase from './meta'
import DateBase from './date'
import { P, H2, H3 } from './body'
import Link from './link'

const Container = styled.article``

const Meta = styled(MetaBase)`
  margin-bottom: 0.5rem;
  ${props => props.theme.mqMin.sm} {
    margin-bottom: 1rem;
  }
`

const Date = styled(DateBase)`
  color: ${props => props.theme.colors.grey};
`

const titleStyle = css`
  margin-bottom: 0.5rem;
`
const Title = styled(H2.withComponent('h1'))`
  ${titleStyle};
`
const SmallTitle = styled(H3.withComponent('h1'))`
  ${titleStyle};
`

const More = styled.div`
  margin-top: -0.5rem;
  font-family: ${props => props.theme.fontFamily.alt};
  ${props => props.theme.mqMin.sm} {
    margin-top: -1rem;
  }
`

type Props = {
  isSmall: boolean,
  path: string,
  title: string,
  dateTime: string,
  excerpt: string,
}

const PostPreview = ({ isSmall, path, title, dateTime, excerpt }: Props) => (
  <Container>
    {isSmall ? (
      <SmallTitle>
        <Link to={path}>{title}</Link>
      </SmallTitle>
    ) : (
      <Title>
        <Link to={path}>{title}</Link>
      </Title>
    )}
    <Meta>
      <Date dateTime={dateTime} />
    </Meta>
    <P>{excerpt}</P>
    <More>
      <Link to={path}>Read more →</Link>
    </More>
  </Container>
)

PostPreview.defaultProps = {
  isSmall: false,
}

export default PostPreview
