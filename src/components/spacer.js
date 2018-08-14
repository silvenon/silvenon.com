// @flow
import styled from 'react-emotion'

const Spacer = styled.div`
  height: 1rem;
  ${props => props.theme.mqMin.sm} {
    height: 2rem;
  }
`

export default Spacer
