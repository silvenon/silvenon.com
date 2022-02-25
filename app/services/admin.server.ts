import { createCookieSessionStorage, redirect } from 'remix'
import { db } from '../utils/db.server'
import bcrypt from 'bcrypt'
import invariant from 'tiny-invariant'

const secret = process.env.ADMIN_SESSION_SECRET

invariant(secret, 'AUTH_SESSION_SECRET must be set')

const storage = createCookieSessionStorage({
  cookie: {
    name: 'admin_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [secret],
    secure: process.env.NODE_ENV === 'production',
  },
})

export async function login(request: Request) {
  const { email, password } = Object.fromEntries(await request.formData())

  invariant(typeof email === 'string', 'Email is required')
  invariant(typeof password === 'string', 'Password is required')

  const admin = await db.admin.findUnique({
    where: { email },
  })

  invariant(admin !== null, 'Invalid email or password')

  const isCorrectPassword = await bcrypt.compare(password, admin.passwordHash)
  invariant(isCorrectPassword, 'Invalid email or password')

  const { searchParams } = new URL(request.url)

  const session = await storage.getSession()
  session.set('adminId', admin.id)
  return redirect(searchParams.get('redirectTo') ?? '/', {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

async function getAdminId(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))
  const adminId = session.get('adminId')
  if (!adminId || typeof adminId !== 'string') return null
  return adminId
}

export async function isLoggedIn(request: Request) {
  return (await getAdminId(request)) !== null
}

export async function getAdmin(request: Request) {
  const adminId = await getAdminId(request)
  if (!adminId) return null
  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId },
    })
    if (!admin) throw new Error(`User ${adminId} not found`)
    return admin
  } catch {
    throw logout(request, new URL(request.url).pathname)
  }
}

export async function requireAdmin(request: Request) {
  if (await isLoggedIn(request)) return
  const searchParams = new URLSearchParams({
    redirectTo: new URL(request.url).pathname,
  })
  throw redirect(`/admin?${searchParams}`)
}

export async function logout(request: Request, redirectTo: string) {
  const session = await storage.getSession(request.headers.get('Cookie'))
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}
