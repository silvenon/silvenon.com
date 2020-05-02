type PostLayoutProps = {
  frontmatter: {
    seriesPart?: number
    title: string
    category: 'DEV' | 'NON_DEV'
    published: string
    lastModified?: string
    tweet?: string
  }
  series?: {
    title: string
    tweet?: string
    parts: Array<{
      title: string
      path: string
    }>
  }
  path: string
  children?: React.ReactNode
}

export type PostLayoutComponent = React.ComponentType<PostLayoutProps>

export type Post = PostLayoutProps & {
  Excerpt: React.ComponentType
  default: PostLayoutComponent
}
