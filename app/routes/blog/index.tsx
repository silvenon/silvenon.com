import { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = () => {
  throw new Response('Not Found', { status: 404 })
}

export default function Blog() {
  return null
}
