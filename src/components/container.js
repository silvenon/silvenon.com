// @flow
import styled from 'react-emotion'

const Container = styled.div`
  max-width: ${props => props.theme.containerMaxWidth}px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.sitePadding};
`

export default Container
