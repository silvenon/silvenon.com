// @flow
import { Link as GatsbyLink } from 'gatsby'
import withClassNames from './with-class-names'
import styles from './link.module.css'

const Link = GatsbyLink

export default withClassNames(styles.link)(Link)
