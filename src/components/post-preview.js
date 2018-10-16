// @flow
import * as React from 'react'
import styled, { css } from 'astroturf'
import classNames from 'classnames'
import MetaBase from './meta'
import DateBase from './date'
import { P, H2, H3 } from './body'
import Link from './link'

const Container = styled.article``

const Meta = styled(MetaBase)`
  margin-bottom: 0.5rem;
  @media (--min-small) {
    margin-bottom: 1rem;
  }
`

const Date = styled(DateBase)`
  color: var(--grey);
`

const styles = css`
  .title {
    margin-bottom: 0.5rem;
  }
`
const Title = (props: { className: ?string }) => (
  <H2
    {...props}
    as="h1"
    className={classNames(styles.title, props.className)}
  />
)
const SmallTitle = (props: { className: ?string }) => (
  <H3
    {...props}
    as="h1"
    className={classNames(styles.title, props.className)}
  />
)
// eslint-disable-next-line no-multi-assign
Title.defaultProps = SmallTitle.defaultProps = {
  className: null,
}

const More = styled.div`
  margin-top: -0.5rem;
  font-family: var(--alt-font-family);
  @media (--min-small) {
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
