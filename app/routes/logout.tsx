import type { LoaderFunction, ActionFunction } from 'remix'
import { logout } from '~/services/admin.server'

export const action: ActionFunction = ({ request }) => {
  const { searchParams } = new URL(request.url)
  return logout(request, searchParams.get('redirectTo') ?? '/')
}

export const loader: LoaderFunction = () => {
  throw new Response('Not Found', { status: 404 })
}

// exporting a blank component allows 404 page to be rendered server-side
export default function Logout() {
  return null
}
