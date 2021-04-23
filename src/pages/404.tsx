import React from 'react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import { proseClassName } from '../consts'
import type { RouteComponentProps } from '@reach/router'

interface Props extends RouteComponentProps {}

export default function NotFound({ uri }: Props) {
  return (
    <Layout
      uri={uri}
      title="Page not found"
      description="This page no longer exists."
    >
      <main className={clsx(proseClassName, 'mx-auto p-4 text-center')}>
        <h1 className="mb-0">Page not found</h1>
        <div className="my-6 flex justify-center sm:my-7 lg:my-8 xl:my-9 2xl:my-10">
          <svg
            className="w-14 h-14 fill-current text-amber-600"
            role="presentation"
          >
            <use href="/icons.svg#exclamation-mark" />
          </svg>
        </div>
        <p>
          This page no longer exists. It&apos;s likely that you got here by
          following a link to my blog post which no longer has that URL. You
          should be able to find the content you&apos;re looking for elsewhere
          on this site, or maybe I even deleted that post!{' '}
          <span role="img" aria-label="embarrassed">
            😳
          </span>
        </p>
      </main>
    </Layout>
  )
}
