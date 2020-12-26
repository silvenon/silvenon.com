import { screen } from '@testing-library/dom'
import { createGitgraph as createGitgraphMock } from '@gitgraph/js'
import '../gitgraph-setup'
import initGitgraph from '../gitgraph-init'
import MatchMediaMock from 'jest-matchmedia-mock'
import { screens } from '../consts'

jest.mock('@gitgraph/js', () => ({
  createGitgraph: jest.fn((container) => {
    const graph = document.createElement('div')
    graph.setAttribute('data-testid', 'graph')
    container.appendChild(graph)
    return {
      branch: () => ({
        commit: () => {},
      }),
    }
  }),
  MergeStyle: {},
}))

let container: HTMLDivElement
let matchMedia: MatchMediaMock
const spyOnAddEventListener = () => jest.spyOn(window, 'addEventListener')
let addEventListenerSpy: ReturnType<typeof spyOnAddEventListener>

beforeAll(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  addEventListenerSpy = spyOnAddEventListener()
  matchMedia = new MatchMediaMock()
})

afterEach(() => {
  container.textContent = ''
  const [type, listener] = addEventListenerSpy.mock.calls[0]
  window.removeEventListener(type, listener)
  matchMedia.clear()
  jest.clearAllMocks()
})

afterAll(() => {
  document.body.removeChild(container)
  addEventListenerSpy.mockRestore()
  matchMedia.destroy()
})

describe('GitGraph', () => {
  test('load graph', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent')
    const script = document.createElement('script')
    script.innerHTML = `
      window.setupGitgraph(gitgraph => {
        const main = gitgraph.branch('main')
        main.commit('Test')
      })
    `
    container.appendChild(script)
    expect(document.querySelector('.gitgraph')).toBeInTheDocument()
    initGitgraph()
    expect(dispatchEventSpy).toHaveBeenCalled()
    expect(createGitgraphMock).toHaveBeenCalledTimes(1)
    screen.getByTestId('graph')
    dispatchEventSpy.mockRestore()
  })

  test('adapt based on media queries', () => {
    const script = document.createElement('script')
    script.innerHTML = `
      window.setupGitgraph(() => {})
    `
    container.appendChild(script)
    initGitgraph()
    expect(createGitgraphMock).toHaveBeenCalledTimes(1)
    matchMedia.useMediaQuery(`(min-width: ${screens.sm})`)
    expect(createGitgraphMock).toHaveBeenCalledTimes(2)
    matchMedia.useMediaQuery('(prefers-color-scheme: dark)')
    expect(createGitgraphMock).toHaveBeenCalledTimes(3)
  })
})
