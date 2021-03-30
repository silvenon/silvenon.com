declare module '@mdx-js/mdx' {
  import { Processor } from 'unified'
  function compileMdx(mdx: string, options: any): Promise<string>
  function createCompiler(options: any): Processor
  export { createCompiler }
  export default compileMdx
}
