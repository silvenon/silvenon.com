import { render, screen } from '@testing-library/react'
import { createRoutesStub, useLoaderData } from 'react-router'
import type { getAllPostsMeta } from '~/utils/posts.server.ts'
import * as homeRoute from './home'

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

const HomeStub = createRoutesStub([
  {
    index: true,
    // https://github.com/remix-run/react-router/issues/12494
    // @ts-expect-error
    loader: homeRoute.loader,
    // @ts-expect-error
    meta: homeRoute.meta,
    HydrateFallback: () => null,
    Component: () => {
      const loaderData = useLoaderData<typeof homeRoute.loader>()
      const Home = homeRoute.default
      // @ts-expect-error
      return <Home loaderData={loaderData} />
    },
    // @ts-expect-error
    ErrorBoundary: homeRoute.ErrorBoundary,
  },
])

test('listing posts', async () => {
  render(<HomeStub />)
  await screen.findByRole('link', {
    name: 'What Tailwind taught me about the separation of concerns',
  })
})
