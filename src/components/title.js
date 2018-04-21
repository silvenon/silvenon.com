import styled from 'react-emotion'

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 2.5rem;
  font-weight: bold;
  ${props => props.theme.mqMin.sm} {
    font-size: 3rem;
  }
`

export { Title }
