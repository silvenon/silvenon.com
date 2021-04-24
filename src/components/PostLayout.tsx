import React from 'react'
import unorphan from 'unorphan'
import { Helmet } from 'react-helmet'
import Layout from './Layout'
import { MDXProvider } from '@mdx-js/react'
import Gitgraph from './Gitgraph'
import ProseImage from './ProseImage'
import HotTip from './HotTip'
import PostDate from './PostDate'
import SeriesParts from './SeriesParts'
import type { RouteComponentProps } from '@reach/router'
import type { StandalonePost, SeriesPart } from '../posts'
import clsx from 'clsx'
import { author, proseClassName } from '../consts'

export const postModules = import.meta.glob('/src/posts/**/post.mdx')

const CONTENT_CLASS_NAME = 'post-content'
const htmlContent = import.meta.env.SSR
  ? null
  : document.querySelector(`.${CONTENT_CLASS_NAME}`)?.innerHTML

interface Props extends RouteComponentProps, StandalonePost {
  StaticMDXComponent?: React.ComponentType
  htmlContent?: string
  seriesPart?: number
  seriesTitle?: string
  parts?: SeriesPart[]
}

interface MDXModule {
  default?: React.ComponentType
}

export default function PostLayout({
  uri,
  StaticMDXComponent,
  importPath,
  seriesPart,
  seriesTitle,
  parts,
  title,
  htmlTitle,
  description,
  published,
  lastModified,
  pathname,
}: Props) {
  const unorphanRef = React.useCallback((node) => {
    if (node) unorphan(node)
  }, [])

  const [mdxModule, setMdxModule] = React.useState<MDXModule | void>()
  React.useEffect(() => {
    postModules[importPath]().then((postModule) => {
      setMdxModule(postModule)
    })
  }, [importPath])
  const DynamicMDXComponent = mdxModule && mdxModule.default

  let content: React.ReactNode = null
  if (StaticMDXComponent) {
    content = (
      <div className={CONTENT_CLASS_NAME}>
        <StaticMDXComponent />
      </div>
    )
  } else if (DynamicMDXComponent) {
    content = <DynamicMDXComponent />
  } else if (htmlContent) {
    content = <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  }

  const footerRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    if (!DynamicMDXComponent || !footerRef.current) return
    const utterances = document.createElement('script')
    utterances.src = 'https://utteranc.es/client.js'
    utterances.async = true
    utterances.crossOrigin = 'anonymous'
    // custom attributes can only be set this way
    utterances.setAttribute('repo', 'silvenon/silvenon.com')
    utterances.setAttribute('issue-term', 'title')
    utterances.setAttribute('theme', 'preferred-color-scheme')

    footerRef.current.innerHTML = ''
    footerRef.current.appendChild(utterances)
  }, [DynamicMDXComponent])

  const hasContent = StaticMDXComponent || DynamicMDXComponent

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

      <main className={clsx(proseClassName, 'mx-auto px-4 mt-2 lg:mt-4')}>
        {seriesTitle && typeof seriesPart === 'number' ? (
          <h1 className="text-center space-y-2 lg:space-y-4">
            <div ref={unorphanRef}>{seriesTitle}</div>
            <div className="font-sans font-normal dark:font-light text-[0.8em]">
              Part {seriesPart + 1}:{' '}
              {htmlTitle ? (
                <span dangerouslySetInnerHTML={{ __html: htmlTitle }} />
              ) : (
                title
              )}
            </div>
          </h1>
        ) : (
          <h1 ref={unorphanRef} className="text-center">
            {htmlTitle ? (
              <span dangerouslySetInnerHTML={{ __html: htmlTitle }} />
            ) : (
              title
            )}
          </h1>
        )}
        <PostDate published={published} />
        {parts && (
          <>
            <SeriesParts parts={parts} pathname={pathname} />
            <hr />
          </>
        )}
        <MDXProvider components={{ Gitgraph, ProseImage, HotTip }}>
          {content}
        </MDXProvider>
        {hasContent && (
          <>
            <div className="text-right -mb-7 sm:-mb-8 md:-mb-9 lg:-mb-10 xl:-mb-11 2xl:-mb-12">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="p-2" href="#">
                Back to top ↑
              </a>
            </div>
            <hr />
          </>
        )}
      </main>

      <footer ref={footerRef} className="px-2.5" />
    </Layout>
  )
}
