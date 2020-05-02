import { createGlobalStyle, GlobalStyleComponent } from 'styled-components'
import theme from './theme'

const BaseStyle: GlobalStyleComponent<{}, typeof theme> = createGlobalStyle`
  html {
    font-size: var(--base-font-size);
  }

  body {
    font-family: var(--base-font-family);
    line-height: var(--line-height);
    font-size: 0.85rem;

    @media ${(props) => props.theme.query.sm} {
      font-size: 1rem;
    }
  }

  code {
    font-family: var(--code-font-family);
    font-size: var(--code-font-size);
  }
`

export default BaseStyle
