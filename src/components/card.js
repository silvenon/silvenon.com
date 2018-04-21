import styled from 'react-emotion'

const Card = styled.div`
  align-self: stretch;
  margin: 0 ${props => -props.theme.sitePadding}rem;
  padding: ${props => props.theme.sitePadding}rem;
  background: #fff;
  ${props => props.theme.boxShadow};
  ${props => props.theme.mqMin.sm} {
    align-self: center;
    margin: 0;
    padding: 2rem;
    border-radius: 0.5rem;
  }
`

export { Card }
