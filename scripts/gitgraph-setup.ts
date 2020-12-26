import { createGitgraph } from '@gitgraph/js'

function setupGitgraph(
  callback: (api: ReturnType<typeof createGitgraph>) => void,
): void {
  const container = document.createElement('div')
  container.classList.add('gitgraph')
  container.innerHTML = `
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `
  document.currentScript?.insertAdjacentElement('afterend', container)
  window.addEventListener('GitgraphLoaded', (event) => {
    event.detail.init(container, callback)
    container.setAttribute('aria-busy', 'false')
  })
}

window.setupGitgraph = setupGitgraph

declare global {
  interface Window {
    setupGitgraph: typeof setupGitgraph
  }
}
