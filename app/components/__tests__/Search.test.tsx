// @vitest-environment jsdom
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import user from '@testing-library/user-event'
import Search from '../Search'

vi.mock('@remix-run/react', () => ({
  useNavigate: () => {
    return () => {}
  },
}))

describe('Search', () => {
  test('shows posts in a dropdown', async () => {
    const OriginalIntersectionObserver = global.IntersectionObserver
    // @ts-ignore: not sure how to fix this type error
    global.IntersectionObserver = class IntersectionObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    user.setup()

    render(
      <>
        <Search
          posts={[
            { slug: 'one', title: 'One' },
            { slug: 'two', title: 'Two' },
          ]}
        />
        <div id="search" />
      </>,
    )

    await user.pointer({
      keys: '[MouseLeft]',
      target: screen.getByRole('button', { name: 'Search' }),
    })
    let combobox = screen.getByRole('combobox')
    await user.keyboard('{Escape}')
    await waitForElementToBeRemoved(combobox)
    await user.keyboard('{Meta>}{k}{/Meta}')
    combobox = screen.getByRole('combobox')
    await user.type(combobox, 'o')
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent('One')
    expect(options[1]).toHaveTextContent('Two')
    await user.type(combobox, 'ne')
    expect(screen.getByRole('option')).toHaveTextContent('One')
    await user.type(combobox, 'foo')
    screen.getByText('No posts found.')

    global.IntersectionObserver = OriginalIntersectionObserver
  })
})
