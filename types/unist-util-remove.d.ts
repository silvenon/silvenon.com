import type { Node } from 'unist'
import type { Test } from 'unist-util-is'

declare module 'unist-util-remove' {
  interface Options {
    cascade: boolean
  }

  const remove: {
    (tree: Node, options: Options, test: Test<V> | Array<Test<any>>): void
    (tree: Node, test: Test<V> | Array<Test<any>>): void
  }

  export default remove
}
