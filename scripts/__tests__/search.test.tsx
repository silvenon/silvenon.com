import React from 'react'
import Search, { init } from '../search'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Search', () => {
  test('init', () => {
    const container = document.createElement('div')
    container.setAttribute('data-search', '')
    document.body.appendChild(container)
    init()
    screen.getByRole('searchbox')
    document.body.removeChild(container)
  })

  test('shows posts in a dropdown', () => {
    render(
      <Search
        posts={[
          { title: 'One', relativeUrl: '/blog/one/', slug: 'one' },
          { title: 'Two', relativeUrl: '/blog/two/', slug: 'two' },
          { title: 'Three', relativeUrl: '/blog/three/', slug: 'three' },
        ]}
      />,
    )
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

  test('opening and closing toggles visibility of associated node', () => {
    const nodeToHide = document.createElement('div')
    nodeToHide.setAttribute('data-search-hide', '')
    document.body.appendChild(nodeToHide)
    render(<Search posts={[]} />)
    expect(nodeToHide).not.toHaveClass('opacity-0')
    fireEvent.focus(screen.getByRole('searchbox'))
    expect(nodeToHide).toHaveClass('opacity-0')
    document.body.removeChild(nodeToHide)
  })
})
