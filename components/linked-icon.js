import styled from 'react-emotion/macro'
import { boxShadow, center } from '../styles'

const LinkedIcon = styled('a')`
  order: 1;
  position: relative;
  display: block;
  width: 5rem;
  height: 5rem;
  border: 0.5rem solid #fff;
  border-radius: 1rem;
  background: ${props => props.color};
  ${boxShadow};
  color: #fff;
  text-decoration: none;
  > svg {
      ${center};
      width: ${props => props.size}rem;
      height: ${props => props.size}rem;
  }
`

export default LinkedIcon
