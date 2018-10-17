// @flow
import { compose } from 'recompose'
import withClassNames from './with-class-names'
import withStyle from './with-style'
import styles from './container.module.css'

export const MAX_WIDTH = 992

export default compose(
  withClassNames(styles.container),
  withStyle({ maxWidth: MAX_WIDTH }),
)('div')
