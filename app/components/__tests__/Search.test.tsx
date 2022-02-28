/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Search from '../Search'

jest.mock('remix', () => ({
  useNavigate: () => {
    return () => {}
  },
}))

describe('Search', () => {
  test('shows posts in a dropdown', () => {
    const OldIntersectionObserver = window.IntersectionObserver
    // @ts-ignore
    window.IntersectionObserver = class IntersectionObserverMock {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }

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

    userEvent.click(screen.getByRole('button', { name: 'Search' }))
    const combobox = screen.getByRole('combobox')
    userEvent.type(combobox, 'o')
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent('One')
    expect(options[1]).toHaveTextContent('Two')
    userEvent.type(combobox, 'ne')
    expect(screen.getByRole('option')).toHaveTextContent('One')
    userEvent.type(combobox, 'foo')
    screen.getByText('No posts found.')

    window.IntersectionObserver = OldIntersectionObserver
  })
})
