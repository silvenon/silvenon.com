import styled from 'react-emotion/macro'
import { SITE_PADDING, BREAKPOINT, BOX_SHADOW } from '../constants'

const Card = styled.div`
  align-self: stretch;
  margin: 0 ${-SITE_PADDING}rem;
  padding: ${SITE_PADDING}rem;
  background: #fff;
  ${BOX_SHADOW}
  @media (min-width: ${BREAKPOINT}) {
    align-self: center;
    margin: 0;
    padding: 2rem;
    border-radius: 0.5rem;
  }
`

export default Card
