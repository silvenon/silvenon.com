// @flow
import * as React from 'react'
import { StaticQuery, graphql, navigate } from 'gatsby'
import styled, { css } from 'astroturf'
import classNames from 'classnames'
import Downshift from 'downshift'
import { FaSearch } from 'react-icons/fa'
import fuzzaldrin from 'fuzzaldrin-plus'
import Link from './link'

const fieldHeight = '2rem'
const fieldBgColor = 'color(#fff shade(5%))'
const menuBgColor = '#fff'
const transitionDuration = 300

const hideStyles = css`
  .base {
    transition: opacity ${transitionDuration}ms;
  }
  .hidden {
    @media (--max-small) {
      opacity: 0;
    }
  }
`

const Container = styled.div`
  position: relative;
  height: ${fieldHeight};
  font-family: var(--alt-font-family);
  @media (--min-medium) {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`

const FieldContainer = styled.div`
  position: relative;
  width: ${fieldHeight};
  transition: width ${transitionDuration}ms;
  @media (--max-small) {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
  &.focused {
    width: calc(100vw - var(--site-padding) * 2 - var(--logo-width) - 1rem);
    @media (--min-medium) {
      width: 100%;
    }
  }
`

const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: ${fieldHeight};
  height: ${fieldHeight};
  margin: 0;
  padding: 0 0.5rem;
  color: color(#000 tint(50%));
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
  composes: visuallyHidden from '../styles/common.module.css';
`

const Input = styled.input`
  display: block;
  width: 100%;
  height: ${fieldHeight};
  line-height: ${fieldHeight};
  padding-left: ${fieldHeight};
  border: 0;
  background: ${fieldBgColor};
  border-radius: ${fieldHeight};
  &::placeholder {
    opacity: 0;
    transition: opacity ${transitionDuration}ms;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #fff, 0 0 0 5px var(--blue);
    &::placeholder {
      opacity: 1;
    }
  }
`

const Menu = styled.ul`
  position: absolute;
  white-space: nowrap;
  top: 100%;
  right: calc(50vw - var(--site-padding));
  transform: translateX(50%);
  width: calc(100vw - var(--site-padding) * 2);
  margin-top: 0.75rem;
  text-align: left;
  font-size: 0.85rem;
  @media (--min-small) {
    right: calc(
      (100vw - var(--site-padding) * 2 - var(--logo-width) - 1rem) / 2
    );
    width: auto;
    min-width: 24em;
    max-width: calc(100vw - var(--site-padding) * 2);
  }
  @media (--min-medium) {
    right: 0;
    transform: none;
  }
  &.open {
    padding: 0.5rem 0;
    background: ${menuBgColor};
    border-top: 1px solid ${fieldBgColor};
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-card2);
  }
`

const Item = styled.li``
const ItemLink = styled(Link)`
  display: block;
  padding: 0.25rem 0.75rem;
  color: color(#000 tint(30%));
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover,
  &:focus {
    color: #000;
    text-decoration: none;
  }
  &.highlighted {
    background: ${fieldBgColor};
  }
`

type Props = {
  children: ({
    searchBar: React.Node,
    styleHide: string,
  }) => React.Node,
}

type State = {
  isFocused: boolean,
}

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

class Search extends React.Component<Props, State> {
  static defaultProps = {
    children: undefined,
  }

  state = {
    isFocused: false,
  }

  render() {
    const { children, ...props } = this.props
    const { isFocused } = this.state
    const searchBar = (
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
                  <Container
                    {...getRootProps({ refKey: 'innerRef', ...props })}
                  >
                    <FieldContainer focused={isFocused}>
                      <Label {...getLabelProps()}>
                        <SearchIcon />
                        <LabelText>Find posts</LabelText>
                      </Label>
                      <Input
                        {...getInputProps({
                          placeholder: 'Find posts',
                          onFocus: () => {
                            this.setState({ isFocused: true })
                          },
                          onBlur: () => {
                            this.setState({ isFocused: false })
                          },
                        })}
                      />
                    </FieldContainer>
                    <Menu
                      {...getMenuProps({
                        refKey: 'innerRef',
                        open: isOpen && posts.length > 0,
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
                            highlighted={index === highlightedIndex}
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
                  </Container>
                )
              }}
            </Downshift>
          )
        }}
      />
    )

    return typeof children === 'function'
      ? children({
          searchBar,
          styleHide: classNames(hideStyles.base, {
            [hideStyles.hidden]: isFocused,
          }),
        })
      : searchBar
  }
}

export default Search
