// Better TypeScript setup for themes
// https://github.com/styled-components/styled-components-website/issues/447

import 'styled-components'
import theme from '../src/styles/theme'

type Theme = typeof theme

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
