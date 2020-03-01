// @flow
import React from 'react'
import classNames from 'classnames'
import Icon from './icon'
import typeset from './typeset'
import withClassNames from './with-class-names'
import styles from './body.module.css'

function CustomA(props: { 'data-autolink': boolean, className: ?string }) {
  /* eslint-disable jsx-a11y/anchor-has-content */
  if (props['data-autolink']) {
    return (
      <a {...props} className={classNames(props.className, styles.autolink)}>
        <Icon id="hash" size="0.6em" />
      </a>
    )
  }
  return <a {...props} />
  /* eslint-enable jsx-a11y/anchor-has-content */
}
CustomA.defaultProps = {
  'data-autolink': false,
  className: null,
}

export const H1 = withClassNames(styles.h1)('h1')
export const H2 = withClassNames(styles.h2)(typeset('h2'))
export const H3 = withClassNames(styles.h3)(typeset('h3'))
export const P = withClassNames(styles.p)('p')
export const A = withClassNames(styles.a)(CustomA)
export const HR = withClassNames(styles.hr)('hr')
export const OL = withClassNames(styles.ol)('ol')
export const UL = withClassNames(styles.ul)('ul')
export const LI = withClassNames(styles.li)('li')
export const Blockquote = withClassNames(styles.blockquote)(typeset('blockquote')) // eslint-disable-line prettier/prettier
export const InlineCode = withClassNames(styles.inlineCode)('code')
export const Pre = withClassNames(styles.pre)('pre')
export const Code = withClassNames(styles.code)('code')
export const Figure = withClassNames(styles.figure)('figure')
export const Img = withClassNames(styles.img)('img')

export const components = {
  H1,
  H2,
  H3,
  H4: () => {
    throw new Error(`<h4> tag is missing from MDX components`)
  },
  H5: () => {
    throw new Error(`<h5> tag is missing from MDX components`)
  },
  H6: () => {
    throw new Error(`<h6> tag is missing from MDX components`)
  },
  P,
  A,
  HR,
  OL,
  UL,
  LI,
  Blockquote,
  Pre,
  InlineCode,
  Code,
  Figure,
  Img,
}
