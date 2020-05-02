// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245#issuecomment-497038332

import { CSSProp } from 'styled-components'

declare module 'react' {
  interface Attributes {
    css?: CSSProp
  }
}
