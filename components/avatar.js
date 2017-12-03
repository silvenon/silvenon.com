import styled from 'react-emotion/macro'
import { BREAKPOINT, AVATAR_SIZE } from '../constants'
import { boxShadow } from '../styles'

const Avatar = styled('img')`
  width: ${AVATAR_SIZE}rem;
  height: ${AVATAR_SIZE}rem;
  margin-bottom: 1rem;
  border: 1rem solid #fff;
  border-radius: 2rem;
  ${boxShadow};
  @media (min-width: ${BREAKPOINT}) {
    margin-bottom: 2rem;
  }
`

export { Avatar }
