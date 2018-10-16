// @flow
import styled from 'astroturf'

export const MAX_WIDTH = 992

const Container = styled.div`
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  padding: 0 var(--site-padding);
`

export default Container
