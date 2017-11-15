import styled from 'react-emotion/macro'
import { BREAKPOINT } from '../constants'

const Name = styled('h1')`
  margin: 0 0 0.5rem;
  font-size: 2.5rem;
  @media (min-width: ${BREAKPOINT}) {
    font-size: 3rem;
  }
`

export default Name
