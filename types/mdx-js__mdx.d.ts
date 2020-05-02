import unified from 'unified'

declare module '@mdx-js/mdx' {
  export default function mdx(
    mdxContent: string,
    options?: {
      footnotes?: boolean
      remarkPlugins?: unified.PluggableList
      rehypePlugins?: unified.PluggableList
      compilers?: unified.Compiler[]
    },
  ): Promise<string>
}
