// @flow
import * as React from 'react'
import { StaticQuery, graphql, navigate } from 'gatsby'
import Downshift from 'downshift'
import { FaSearch } from 'react-icons/fa'
import fuzzaldrin from 'fuzzaldrin-plus'
import Link from './link'
import withClassNames from './with-class-names'
import styles from './search.module.css'

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

  rootRef = React.createRef()

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
                  <div {...props}>
                    <div
                      className={isFocused ? styles.fieldFocused : styles.field}
                    >
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                      <label {...getLabelProps({ className: styles.label })}>
                        <FaSearch className={styles.labelIcon} />
                        <span className={styles.labelText}>Find posts</span>
                      </label>
                      <input
                        {...getInputProps({
                          placeholder: 'Find posts',
                          className: styles.input,
                          onFocus: () => {
                            this.setState({ isFocused: true })
                          },
                          onBlur: () => {
                            this.setState({ isFocused: false })
                          },
                        })}
                      />
                    </div>
                    <ul
                      {...getMenuProps({
                        className:
                          isOpen && posts.length > 0
                            ? styles.menuOpen
                            : styles.menu,
                      })}
                    >
                      {posts.map(({ title, path }, index) => (
                        <li
                          {...getItemProps({
                            key: title,
                            index,
                            item: { title, path },
                          })}
                        >
                          <Link
                            to={path}
                            className={
                              index === highlightedIndex
                                ? styles.itemLinkHighlighted
                                : styles.itemLink
                            }
                            dangerouslySetInnerHTML={{
                              __html: fuzzaldrin.wrap(title, inputValue),
                            }}
                            onClick={event => {
                              event.stopPropagation()
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
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
          styleHide: isFocused ? styles.hidden : styles.hiddenBase,
        })
      : searchBar
  }
}

export default withClassNames(styles.container)(Search)
