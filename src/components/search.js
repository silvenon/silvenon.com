// @flow
import * as React from 'react'
import { StaticQuery, graphql, navigate } from 'gatsby'
import styled, { css, cx } from 'react-emotion'
import { lighten } from 'polished'
import Downshift from 'downshift'
import { FaSearch } from 'react-icons/fa'
import fuzzaldrin from 'fuzzaldrin-plus'
import Link from './link'

const fieldHeight = '2rem'
const bgColor = lighten(0.95, '#000')
const transitionDuration = 300

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: ${props => props.theme.zIndex.search};
  font-family: ${props => props.theme.fontFamily.alt};
`

const FieldContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  /* avoiding a tiny border glitch */
  background: #fff;
  box-shadow: 0 0 1.5rem 0.75rem #fff;
  border-radius: ${fieldHeight};
  overflow: hidden;
`

const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: ${fieldHeight};
  height: ${fieldHeight};
  margin: 0;
  padding: 0 0.5rem;
  color: ${lighten(0.5, '#000')};
  cursor: pointer;
  line-height: ${fieldHeight};
`
const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const LabelText = styled.span`
  ${props => props.theme.visuallyHidden};
`

const Input = styled.input`
  display: block;
  width: ${fieldHeight};
  height: ${fieldHeight};
  line-height: ${fieldHeight};
  padding-left: ${fieldHeight};
  border: 0;
  outline-offset: 4px;
  background: ${bgColor};
  border-radius: ${fieldHeight};
  transition: width ${transitionDuration}ms;
  &::placeholder {
    opacity: 0;
    transition: opacity ${transitionDuration}ms;
  }
  &:focus {
    width: 15rem;
    &::placeholder {
      opacity: 1;
    }
  }
`

const MenuContainer = styled.div`
  position: relative;
`
const Menu = styled.ul`
  position: absolute;
  white-space: nowrap;
  top: ${fieldHeight};
  right: 0;
  padding: 0.5rem 0;
  background: ${bgColor};
  border-radius: ${props => props.theme.borderRadius};
  ${props => props.theme.boxShadow};
  text-align: left;
  font-size: 0.75rem;
`
const menuOpen = css`
  padding: 0.5rem 0;
`
const menuArrow = css`
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 5rem;
    transform: translateY(-100%);
    border: 0.75rem solid transparent;
    border-top: 0;
    border-bottom-color: ${bgColor};
  }
`

const Item = styled.li``
const ItemLink = styled(Link)`
  display: block;
  padding: 0.25rem 0.75rem;
  color: ${lighten(0.25, '#000')};
  text-decoration: none;
  &:hover,
  &:focus {
    color: #000;
    text-decoration: none;
  }
`
const itemLinkHighlighted = css`
  background: ${lighten(0.85, '#000')};
`

type Props = {}

type QueryData = {
  allMdx: {
    edges: Array<{
      node: {
        fields: { path: string },
        exports: {
          meta: { title: string },
        },
      },
    }>,
  },
}

const Search = (props: Props) => (
  <StaticQuery
    query={graphql`
      query SearchQuery {
        allMdx {
          edges {
            node {
              fields {
                path
              }
              exports {
                meta {
                  title
                }
              }
            }
          }
        }
      }
    `}
    render={({ allMdx: { edges } }: QueryData) => {
      const postTitles = edges.map(({ node }) => node.exports.meta.title)
      return (
        <Downshift
          onChange={({ path }) => navigate(path)}
          itemToString={post => (post != null ? post.title : '')}
        >
          {({
            getRootProps,
            getLabelProps,
            getInputProps,
            getMenuProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => {
            const posts: Array<{ title: string, path: string }> = isOpen
              ? fuzzaldrin.filter(postTitles, inputValue).map(title => {
                  const edge = edges.find(
                    ({ node }) => node.exports.meta.title === title,
                  )
                  if (edge == null) {
                    throw new Error(
                      `Blog post under the title "${title}" not found`,
                    )
                  }
                  const { path } = edge.node.fields
                  return { title, path }
                })
              : []
            return (
              <Container {...getRootProps({ refKey: 'innerRef', ...props })}>
                <FieldContainer>
                  <Label {...getLabelProps()}>
                    <SearchIcon />
                    <LabelText>Find posts</LabelText>
                  </Label>
                  <Input
                    {...getInputProps({
                      placeholder: 'Find posts',
                    })}
                  />
                </FieldContainer>
                <MenuContainer>
                  <Menu
                    {...getMenuProps({
                      refKey: 'innerRef',
                      className: cx({
                        [menuOpen]: isOpen,
                        [menuArrow]: posts.length > 0,
                      }),
                    })}
                  >
                    {posts.map(({ title, path }, index) => (
                      <Item
                        {...getItemProps({
                          key: title,
                          index,
                          item: { title, path },
                        })}
                      >
                        <ItemLink
                          to={path}
                          className={
                            index === highlightedIndex
                              ? itemLinkHighlighted
                              : null
                          }
                          dangerouslySetInnerHTML={{
                            __html: fuzzaldrin.wrap(title, inputValue),
                          }}
                          onClick={event => {
                            event.stopPropagation()
                          }}
                        />
                      </Item>
                    ))}
                  </Menu>
                </MenuContainer>
              </Container>
            )
          }}
        </Downshift>
      )
    }}
  />
)

export default Search
