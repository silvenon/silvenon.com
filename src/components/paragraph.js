import styled from 'react-emotion'

const Paragraph = styled.div`
  font-size: 1.25rem;
  line-height: 1.5em;
  > p {
    margin-top: 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  ${props => props.theme.mqMin.sm} {
    max-width: 26em;
    font-size: 1.5rem;
  }
`

export { Paragraph }
