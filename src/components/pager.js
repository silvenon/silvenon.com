// @flow
import React from 'react'
import Link from './link'
import styles from './pager.module.css'

type Props = {
  page: number,
  total: number,
  prevLabel: string,
  prevPath: ?string,
  nextLabel: string,
  nextPath: ?string,
}

const Pager = ({
  page,
  total,
  prevLabel,
  prevPath,
  nextLabel,
  nextPath,
}: Props) => (
  <div className={styles.container}>
    <div className={styles.inner}>
      {prevPath != null ? (
        <Link to={prevPath} className={styles.navLinkLeft}>
          {prevLabel}
        </Link>
      ) : (
        <div className={styles.navDisabled}>{prevLabel}</div>
      )}
      <div className={styles.status}>
        Page {page + 1} of {total}
      </div>
      {nextPath != null ? (
        <Link to={nextPath} className={styles.navLinkRight}>
          {nextLabel}
        </Link>
      ) : (
        <div className={styles.navDisabled}>{nextLabel}</div>
      )}
    </div>
  </div>
)

Pager.defaultProps = {
  prevLabel: 'Previous page',
  nextLabel: 'Next page',
}

export default Pager
