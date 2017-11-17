import styled from 'react-emotion/macro'
import { BREAKPOINT } from '../constants'

const Paragraph = styled('div')`
  font-size: 1.25rem;
  line-height: 1.5em;
  > p {
    margin-top: 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  @media (min-width: ${BREAKPOINT}) {
    max-width: 26em;
    font-size: 1.5rem;
  }
`

export default Paragraph
