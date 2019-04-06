// @flow
import React from 'react'
import Icon from './icon'
import Link from './link'
import styles from './filters.module.css'

const iconSize = 24

type Props = {
  basePath: string,
  items: Array<{
    path: string,
    name: string,
    shortName: string,
    iconId: string,
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
        {items.map(({ path, name, shortName, iconId }) =>
          path === currentPath ? (
            <div key={path} className={styles.filterActive}>
              <div className={styles.name}>{name}</div>
              <div className={styles.shortName}>{shortName}</div>
              <Link to={basePath} className={styles.close}>
                <Icon id="cross" size={iconSize} />
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
                <Icon id={iconId} size={iconSize} />
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
