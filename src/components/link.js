// @flow
import * as React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { A } from './body'

const Link = (props: *) => <A as={GatsbyLink} {...props} />

export default Link
