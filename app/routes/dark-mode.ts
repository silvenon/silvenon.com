import { json, redirect } from '@remix-run/node'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { createDarkModeSession, resetDarkModeToOS } from '~/session.server'

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData()
  const { darkMode } = Object.fromEntries(form)

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

export async function loader(_: LoaderFunctionArgs) {
  return redirect('/')
}
