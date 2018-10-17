// @flow
import typeset from './typeset'
import withClassNames from './with-class-names'
import styles from './body.module.css'

export const H1 = withClassNames(styles.h1)('h1')
export const H2 = withClassNames(styles.h2)(typeset('h2'))
export const H3 = withClassNames(styles.h3)(typeset('h3'))
export const P = withClassNames(styles.p)('p')
export const A = withClassNames(styles.a)('a')
export const HR = withClassNames(styles.hr)('hr')
export const OL = withClassNames(styles.ol)('ol')
export const UL = withClassNames(styles.ul)('ul')
export const LI = withClassNames(styles.li)('li')
export const Blockquote = withClassNames(styles.blockquote)(typeset('blockquote')) // eslint-disable-line prettier/prettier
export const Code = withClassNames(styles.code)('code')
export const Pre = withClassNames(styles.pre)('pre')
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
  InlineCode: Code,
  Figure,
  Img,
}
