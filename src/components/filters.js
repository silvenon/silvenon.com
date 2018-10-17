// @flow
import * as React from 'react'
import { Link } from 'gatsby'
import { FaTimes } from 'react-icons/fa'
import styles from './filters.module.css'

const iconSize = 24

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
    <div className={styles.container}>
      <div className={styles.list}>
        {items.map(
          ({ path, name, shortName, Icon }) =>
            path === currentPath ? (
              <div key={path} className={styles.filterActive}>
                <div className={styles.name}>{name}</div>
                <div className={styles.shortName}>{shortName}</div>
                <Link to={basePath} className={styles.close}>
                  <FaTimes size={iconSize} />
                </Link>
              </div>
            ) : (
              <Link
                key={path}
                to={`${basePath}${path}`}
                className={styles.filter}
              >
                <div className={styles.name}>{name}</div>
                <div className={styles.shortName}>{shortName}</div>
                <div className={styles.iconContainer}>
                  <Icon size={iconSize} />
                </div>
              </Link>
            ),
        )}
      </div>
      <div className={styles.state}>
        {filterName != null ? (
          <>
            Viewing only <strong>{filterName}</strong> posts
          </>
        ) : (
          <>
            Viewing <strong>all</strong> posts
          </>
        )}
      </div>
    </div>
  )
}

Filters.defaultProps = {
  currentPath: null,
}

export default Filters
