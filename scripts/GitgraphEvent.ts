import { createGitgraph } from '@gitgraph/js'

// https://github.com/microsoft/TypeScript/issues/28357#issuecomment-711417931

const gitgraphEventType = 'GitgraphLoaded'

interface GitgraphEventDetail {
  init(
    container: HTMLElement,
    callback: (api: ReturnType<typeof createGitgraph>) => void,
  ): void
}

class GitgraphEvent extends CustomEvent<GitgraphEventDetail> {
  constructor(detail: GitgraphEventDetail) {
    super(gitgraphEventType, { detail })
  }
}

export default GitgraphEvent

// augment your global namespace
// here, we're augmenting 'WindowEventMap' from 'lib.dom.d.ts'
declare global {
  interface WindowEventMap {
    [gitgraphEventType]: GitgraphEvent
  }
}
