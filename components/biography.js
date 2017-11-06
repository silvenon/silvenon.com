import styled from 'react-emotion/macro'

const Biography = styled('div')`
  max-width: 26em;
  font-size: 1.5rem;
  line-height: 1.5em;
  > p {
    margin-top: 0;
    &:last-child {
      margin-bottom: 0;
    }
  }

  padding-bottom: 2rem;
  border-bottom: 0.25rem solid currentColor;
  margin-bottom: 2rem;
`

export default Biography
