import { render, screen } from '@testing-library/react'
import { createRemixStub } from '@remix-run/testing'
import type { getAllPostsMeta } from '~/utils/posts.server.ts'
import * as homeRoute from '../_index'

type PostsMeta = ReturnType<typeof getAllPostsMeta>

vi.mock('~/utils/posts.server', () => ({
  async getAllPostsMeta(): PostsMeta {
    return [
      {
        slug: 'tailwind-and-separation-of-concerns',
        title: 'What Tailwind taught me about the separation of concerns',
        description:
          'Despite trying out numerous methods of writing CSS, I never felt that my code was resilient. Utility-first CSS helped me rethink separation of concerns.',
      },
    ]
  },
}))

const HomeStub = createRemixStub([
  {
    index: true,
    loader: homeRoute.loader,
    meta: homeRoute.meta,
    Component: homeRoute.default,
    ErrorBoundary: homeRoute.ErrorBoundary,
  },
])

test('listing posts', async () => {
  render(<HomeStub />)
  await screen.findByRole('link', {
    name: 'What Tailwind taught me about the separation of concerns',
  })
})
