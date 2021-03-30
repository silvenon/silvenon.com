import React from 'react'
import unorphan from 'unorphan'
import { Helmet } from 'react-helmet'
import Layout from './Layout'
import { MDXProvider } from '@mdx-js/react'
import Gitgraph from './Gitgraph'
import ProseImage from './ProseImage'
import PostDate from './PostDate'
import SeriesParts from './SeriesParts'
import queryString from 'query-string'
import type { RouteComponentProps } from '@reach/router'
import type { StandalonePost, SeriesPart } from '../posts'
import clsx from 'clsx'
import { SITE_URL, author, proseClassName } from '../consts'

export const postModules = import.meta.glob('/src/posts/**/post.mdx')

interface Props extends RouteComponentProps, StandalonePost {
  StaticMDXComponent?: React.ComponentType
  seriesPart?: number
  seriesTitle?: string
  parts?: SeriesPart[]
}

export default function StandalonePostLayout({
  uri,
  StaticMDXComponent,
  importPath,
  seriesPart,
  seriesTitle,
  parts,
  title,
  description,
  published,
  lastModified,
  tweet,
  pathname,
}: Props) {
  const [
    dynamicMdxContent,
    setDynamicMdxContent,
  ] = React.useState<React.ReactNode>(null)
  const unorphanRef = React.useCallback((node) => {
    if (node) unorphan(node)
  }, [])
  React.useEffect(() => {
    if (!StaticMDXComponent) {
      postModules[importPath]().then(({ default: DynamicMDXComponent }) => {
        setDynamicMdxContent(<DynamicMDXComponent />)
      })
    }
  }, [])
  return (
    <Layout uri={uri} title={title} description={description}>
      <Helmet>
        <meta key="og:type" property="og:type" content="article" />
        {published && (
          <meta
            key="article:published_time"
            property="article:published_time"
            content={published}
          />
        )}
        <meta
          key="article:author"
          property="article:author"
          content={author.name}
        />
        {lastModified && (
          <meta
            key="article:modified_time"
            property="article:modified_time"
            content={lastModified}
          />
        )}
      </Helmet>

      <main className={clsx(proseClassName, 'mx-auto px-4')}>
        {seriesTitle && typeof seriesPart === 'number' ? (
          <h1 className="text-center space-y-2 lg:space-y-4">
            <div ref={unorphanRef}>{seriesTitle}</div>
            <div className="font-normal dark:font-light text-[0.8em]">
              Part {seriesPart + 1}: {title}
            </div>
          </h1>
        ) : (
          <h1 ref={unorphanRef} className="text-center">
            {title}
          </h1>
        )}
        <PostDate published={published} />
        {parts && (
          <>
            <SeriesParts parts={parts} pathname={pathname} />
            <hr />
          </>
        )}
        <MDXProvider components={{ Gitgraph, ProseImage }}>
          {StaticMDXComponent ? <StaticMDXComponent /> : dynamicMdxContent}
        </MDXProvider>
        <div className="text-right -mb-7 sm:-mb-8 md:-mb-9 lg:-mb-10 xl:-mb-11 2xl:-mb-12">
          <a className="p-2" href="#">
            Back to top ↑
          </a>
        </div>
        <hr />
      </main>

      <footer className="py-4 flex flex-col items-center space-y-2">
        <div className="flex justify-center items-center space-x-4">
          <a
            className="block py-2 px-4 border-2 border-twitter text-twitter font-medium rounded-md hover:bg-twitter hover:text-white lg:text-xl xl:text-2xl"
            href={`https://twitter.com/intent/tweet?${queryString.stringify({
              text: seriesTitle ? `${seriesTitle}: ${title}` : title,
              url: `${SITE_URL}${pathname}`,
              via: 'silvenon',
            })}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Share
          </a>
          {tweet && (
            <a
              className="block py-2 px-4 border-2 border-twitter text-twitter font-medium rounded-md hover:bg-twitter hover:text-white lg:text-xl xl:text-2xl"
              href={tweet}
              target="_blank"
              rel="noreferrer noopener"
            >
              Discuss
            </a>
          )}
        </div>
        <div className={proseClassName}>
          on Twitter
          <br />
        </div>
      </footer>
    </Layout>
  )
}
