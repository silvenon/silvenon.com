// @flow
import styled from 'react-emotion'
import { darken } from 'polished'
import theme from '../styles/theme'

const Meta = styled.div`
  font-family: ${theme.fontFamily.base};
  font-style: italic;
  color: ${darken(0.1, theme.colors.grey)};
`

export default Meta
