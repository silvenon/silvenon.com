import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ServerLocation } from '@reach/router'
import { Helmet } from 'react-helmet'
import App from '../App'
import { posts } from '../posts'
import globby from 'globby'
import fsx from 'fs-extra'
import path from 'path'
import dedent from 'dedent'

const postModules = import.meta.globEager('/src/posts/**/post.mdx')

function render(url: string) {
  let PostComponent: React.ComponentType | undefined
  if (url.startsWith('/blog/')) {
    const postModulePath = path.join(
      `${url.replace('/blog/', '/src/posts/')}`,
      'post.mdx',
    )
    PostComponent = postModules[postModulePath].default
  }
  const body = ReactDOMServer.renderToString(
    <ServerLocation url={url}>
      <App PostComponent={PostComponent} />
    </ServerLocation>,
  )
  return {
    helmet: Helmet.renderStatic(),
    body,
  }
}

export async function generatePages(template: string) {
  const routes = [
    ...(await globby('src/pages/**/*.{ts,tsx,mdx}')).map((filePath) => {
      const { dir, name } = path.parse(filePath)
      return path.join(
        '/',
        dir.replace('src/pages', ''),
        name === 'index' ? '' : name,
      )
    }),
    ...posts.map((post) => post.pathname.replace(/\/$/, '')),
  ]

  await Promise.all(
    routes.map(async (url) => {
      const { helmet, body } = render(url)
      const html = template
        .replace(
          '<!-- head-content -->',
          dedent`
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
          `,
        )
        .replace(`<!-- body-content -->`, body)
      const filePath = url.endsWith('/404')
        ? 'dist/static/404.html'
        : path.join('dist/static', url, 'index.html')
      await fsx.outputFile(filePath, html)
    }),
  )
}
