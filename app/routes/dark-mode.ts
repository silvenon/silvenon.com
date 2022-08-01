import { json, redirect } from '@remix-run/node'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { createDarkModeSession, resetDarkModeToOS } from '~/session.server'

export async function action({ request }: ActionArgs) {
  const form = await request.formData()
  const { darkMode } = Object.fromEntries(form.entries())

  if (darkMode === 'os') {
    return resetDarkModeToOS(request)
  }

  if (darkMode === 'true' || darkMode === 'false') {
    return createDarkModeSession({ request, darkMode })
  }

  return json(
    { error: `invalid darkMode: ${JSON.stringify(darkMode)}` },
    { status: 400 },
  )
}

export async function loader(_: LoaderArgs) {
  return redirect('/')
}
