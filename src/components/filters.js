// @flow
import * as React from 'react'
import { Link } from 'gatsby'
import styled, { css } from 'react-emotion'
import { FaTimes } from 'react-icons/fa'
import { lighten, darken } from 'polished'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  font-family: ${props => props.theme.fontFamily.alt};
  ${props => props.theme.mqMin.sm} {
    margin-bottom: 2rem;
  }
`

const FilterState = styled.p`
  margin-top: 0.5rem;
  color: ${props => props.theme.colors.grey};
`

const FilterList = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 0.5rem;
  }
`

const iconSize = 24

const commonFilterStyles = props => css`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: ${props.theme.borderRadius};
`

const Filter = styled(Link)`
  ${commonFilterStyles};
  background: ${props => lighten(0.3, props.theme.colors.red)};
  color: ${props => props.theme.colors.red};
  &:hover,
  &:focus {
    color: ${props => darken(0.25, props.theme.colors.red)};
    text-decoration: none;
  }
`

const FilterActive = styled.div`
  ${commonFilterStyles};
  background: ${props => props.theme.colors.red};
  color: #fff;
`

const FilterShortName = styled.div`
  display: block;
  ${props => props.theme.mqMin.sm} {
    display: none;
  }
`
const FilterName = styled.div`
  display: none;
  ${props => props.theme.mqMin.sm} {
    display: block;
  }
`

const IconContainer = styled.div`
  display: block;
  margin-left: 0.5rem;
  line-height: 0;
`

const Close = styled(IconContainer.withComponent(Link))`
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
