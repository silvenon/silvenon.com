interface ImportMetaEnv {
  readonly SCREEN_SM: string
  readonly SCREEN_MD: string
  readonly SCREEN_LG: string
  readonly SCREEN_XL: string
  readonly SCREEN_2XL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.mdx' {
  import type { MDXContent } from 'mdx'
  let Component: MDXContent
  export default Component
}
