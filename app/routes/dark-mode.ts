import { redirect, data } from 'react-router'
import { createDarkModeSession, resetDarkModeToOS } from '~/session.server'
import type { Route } from './+types/dark-mode'

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const { darkMode } = Object.fromEntries(form)

  if (darkMode === 'os') {
    return resetDarkModeToOS(request)
  }

  if (darkMode === 'true' || darkMode === 'false') {
    return createDarkModeSession({ request, darkMode })
  }

  return data(
    { error: `invalid darkMode: ${JSON.stringify(darkMode)}` },
    { status: 400 },
  )
}

export async function loader(_: Route.LoaderArgs) {
  return redirect('/')
}
