import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Search from '../Search'

jest.mock('@reach/router', () => ({
  useNavigate() {
    return () => {}
  },
}))

jest.mock('../../posts', () => ({
  posts: [
    { title: 'One', pathname: '/blog/one' },
    { title: 'Two', pathname: '/blog/two' },
  ],
}))

describe('Search', () => {
  test('shows posts in a dropdown', () => {
    render(<Search />)
    const searchBox = screen.getByRole('searchbox')
    userEvent.type(searchBox, 'o')
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent('One')
    expect(options[1]).toHaveTextContent('Two')
    userEvent.type(searchBox, 'ne')
    expect(screen.getByRole('option')).toHaveTextContent('One')
    userEvent.type(searchBox, 'foo')
    expect(screen.getByRole('option')).toHaveTextContent('No results')
  })
})
