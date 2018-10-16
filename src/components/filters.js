// @flow
import * as React from 'react'
import { Link } from 'gatsby'
import styled, { css } from 'astroturf'
import { FaTimes } from 'react-icons/fa'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  font-family: var(--alt-font-family);
  @media (--min-small) {
    margin-bottom: 2rem;
  }
`

const FilterState = styled.p`
  margin-top: 0.5rem;
  color: var(--grey);
`

const FilterList = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 0.5rem;
  }
`

const iconSize = 24

// eslint-disable-next-line no-unused-vars
const styles = css`
  .base {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
  }
`

const Filter = styled(Link)`
  composes: base from './filters-styles.module.css';
  background: color(var(--red) tint(90%));
  color: var(--red);
  &:hover,
  &:focus {
    color: color(var(--red) shade(85%));
    text-decoration: none;
  }
`

const FilterActive = styled.div`
  composes: base from './filters-styles.module.css';
  background: var(--red);
  color: #fff;
`

const FilterShortName = styled.div`
  display: block;
  @media (--min-small) {
    display: none;
  }
`
const FilterName = styled.div`
  display: none;
  @media (--min-small) {
    display: block;
  }
`

const IconContainer = styled.div`
  display: block;
  margin-left: 0.5rem;
  line-height: 0;
`

const IconContainerLink = (props: *) => <IconContainer as={Link} {...props} />
const Close = styled(IconContainerLink)`
  color: inherit;
  &:hover,
  &:focus {
    color: inherit;
  }
`

type Props = {
  basePath: string,
  items: Array<{
    path: string,
    name: string,
    shortName: string,
    Icon: React.ComponentType<*>,
  }>,
  currentPath: ?string,
}

const Filters = ({ basePath, items, currentPath }: Props) => {
  const currentFilter = items.find(({ path }) => path === currentPath)
  const filterName =
    currentFilter != null ? currentFilter.name.toLowerCase() : null
  return (
    <Container>
      <FilterList>
        {items.map(
          ({ path, name, shortName, Icon }) =>
            path === currentPath ? (
              <FilterActive key={path}>
                <FilterName>{name}</FilterName>
                <FilterShortName>{shortName}</FilterShortName>
                <Close to={basePath}>
                  <FaTimes size={iconSize} />
                </Close>
              </FilterActive>
            ) : (
              <Filter key={path} to={`${basePath}${path}`}>
                <FilterName>{name}</FilterName>
                <FilterShortName>{shortName}</FilterShortName>
                <IconContainer>
                  <Icon size={iconSize} />
                </IconContainer>
              </Filter>
            ),
        )}
      </FilterList>
      <FilterState>
        {filterName != null ? (
          <>
            Viewing only <strong>{filterName}</strong> posts
          </>
        ) : (
          <>
            Viewing <strong>all</strong> posts
          </>
        )}
      </FilterState>
    </Container>
  )
}

Filters.defaultProps = {
  currentPath: null,
}

export default Filters
