import styled from 'react-emotion'

const Avatar = styled.img`
  width: 12rem;
  height: 12rem;
  margin-bottom: 1rem;
  border: 1rem solid #fff;
  border-radius: 2rem;
  ${props => props.theme.boxShadow};
  ${props => props.theme.mqMin.sm} {
    margin-bottom: 2rem;
  }
`

export { Avatar }
