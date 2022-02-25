import { Form, json, redirect, useActionData } from 'remix'
import type { LoaderFunction, ActionFunction } from 'remix'
import { LockClosedIcon } from '@heroicons/react/solid'
import { isLoggedIn, login } from '~/services/admin.server'

export const loader: LoaderFunction = async ({ request }) => {
  return (await isLoggedIn(request)) ? redirect('/') : null
}

export const action: ActionFunction = async ({ request }) => {
  try {
    return await login(request)
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof Error) {
      return json(
        { error: err.message.replace(/Invariant failed:\s*/, '') },
        400,
      )
    }
  }
}

export default function Admin() {
  const data = useActionData<{ error: string }>()
  return (
    <Form
      method="post"
      className="mx-auto w-full max-w-md space-y-8 py-12 px-4 sm:px-6 lg:px-8"
    >
      <h2 className="mt-6 text-center text-3xl font-extrabold dark:text-white">
        Sign in to your account
      </h2>
      <div className="mt-8 space-y-6">
        <div className="space-y-4 rounded-md shadow-sm">
          {[
            {
              label: 'Email',
              name: 'email',
              type: 'email',
              placeholder: 'you@example.com',
              autoComplete: 'email',
            },
            {
              label: 'Password',
              name: 'password',
              type: 'password',
              placeholder: '123',
              autoComplete: 'current-password',
            },
          ].map(({ label, ...fieldProps }) => (
            <div
              key={fieldProps.name}
              className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 dark:border-gray-500 dark:focus-within:border-purple-400 dark:focus-within:ring-purple-400"
            >
              <label
                htmlFor={fieldProps.name}
                className="absolute -top-2 left-2 -mt-px inline-block bg-page px-1 text-xs font-medium text-gray-900 dark:bg-page-dark dark:text-white"
              >
                {label}
              </label>
              <input
                id={fieldProps.name}
                {...fieldProps}
                required
                className="block w-full border-0 bg-transparent p-0 text-gray-900 placeholder-gray-500 focus:ring-0 dark:text-white dark:placeholder-gray-400 sm:text-sm"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-page dark:focus:ring-offset-page-dark"
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon
              className="h-5 w-5 text-purple-400"
              aria-hidden="true"
            />
          </span>
          Sign in
        </button>
        {data?.error ? <p className="text-red-400">{data.error}</p> : null}
      </div>
    </Form>
  )
}
