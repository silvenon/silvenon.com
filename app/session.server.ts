import { createCookieSessionStorage, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

const DARK_MODE_SESSION_KEY = 'darkMode'

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export async function getDarkMode(
  request: Request,
): Promise<boolean | undefined> {
  const session = await getSession(request)
  const darkMode = session.get(DARK_MODE_SESSION_KEY)
  return darkMode
}

export async function createDarkModeSession({
  request,
  darkMode,
}: {
  request: Request
  darkMode: 'true' | 'false'
}) {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirectTo') ?? '/'
  const session = await getSession(request)
  session.set(DARK_MODE_SESSION_KEY, darkMode === 'true')
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  })
}

export async function resetDarkModeToOS(request: Request) {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirectTo') ?? '/'
  const session = await getSession(request)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}
