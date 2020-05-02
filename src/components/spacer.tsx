import styled from 'styled-components'

const Spacer = styled.div`
  height: 1rem;
  @media ${(props) => props.theme.query.sm} {
    height: 2rem;
  }
`

export default Spacer
