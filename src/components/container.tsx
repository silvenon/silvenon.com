import styled from 'styled-components'

export const MAX_WIDTH = 992

const Container = styled.div`
  margin: 0 auto;
  padding: 0 var(--site-padding);
  max-width: ${MAX_WIDTH}px;
`

export default Container
