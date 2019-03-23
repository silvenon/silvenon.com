// @flow
import React, { type Node, type Element } from 'react'
import classNames from 'classnames'
import Container from './container'
import Logo from './logo'
import Search from './search'
import styles from './header.module.css'

type Props = {
  children: Node,
}

const Header = ({ children }: Props) => (
  <header className={styles.header}>
    <Container>{children}</Container>
  </header>
)

Header.TopBar = ({ children }: { children: Element<any> }) => (
  <Search>
    {({ searchBar, styleHide }) => (
      <div className={styles.topBar}>
        <div>
          <Logo />
        </div>
        <div className={classNames(styles.middle, styleHide)}>{children}</div>
        <div>{searchBar}</div>
      </div>
    )}
  </Search>
)

export default Header
