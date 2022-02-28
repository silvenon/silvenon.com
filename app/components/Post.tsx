import { Link, useLocation } from 'remix'
import { useMemo, useCallback } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import unorphan from 'unorphan'
import Prose from '~/components/Prose'
import PostDate from '~/components/PostDate'
import Gitgraph from '~/components/Gitgraph'
import Tweet from '~/components/Tweet'
import ProseImage from '~/components/ProseImage'
import HotTip from '~/components/HotTip'
import ESLintPrettierDiagram from '~/components/ESLintPrettierDiagram'
import * as prettyCodeComponents from '~/components/pretty-code'
import { useDarkMode } from '~/services/dark-mode'

interface StandalonePost {
  title: string
  htmlTitle?: string
  published?: Date
  code: string
}

interface SeriesPart extends Omit<StandalonePost, 'published'> {
  seriesPart: number
  series: {
    slug: string
    title: string
    published?: Date
    parts: Array<{
      slug: string
      title: string
    }>
  }
}

type Props = StandalonePost | SeriesPart

export default function Post(props: Props) {
  const PostContent = useMemo(() => getMDXComponent(props.code), [props.code])
  const location = useLocation()
  const darkMode = useDarkMode()

  let commentsTheme = darkMode ? 'github-dark' : 'github-light'
  if (darkMode === null) {
    commentsTheme = 'preferred-color-scheme'
  }

  const isSeries = 'series' in props

  const unorphanRef = useCallback(
    (node) => {
      if (node) unorphan(node)
    },
    // unorphan needs to be computed when these change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSeries],
  )

  return (
    <Prose className="space-y-4">
      <main>
        {isSeries ? (
          <h1 className="space-y-2 text-center lg:space-y-4">
            <div ref={unorphanRef}>{props.series.title}</div>
            <div className="text-[0.8em] font-normal dark:font-light">
              Part {props.seriesPart + 1}:{' '}
              {props.htmlTitle ? (
                <span dangerouslySetInnerHTML={{ __html: props.htmlTitle }} />
              ) : (
                props.title
              )}
            </div>
          </h1>
        ) : (
          <h1 ref={unorphanRef} className="text-center">
            {props.htmlTitle ? (
              <span dangerouslySetInnerHTML={{ __html: props.htmlTitle }} />
            ) : (
              props.title
            )}
          </h1>
        )}

        <PostDate
          published={
            (isSeries ? props.series.published : props.published) ?? undefined
          }
        />

        {isSeries ? (
          <>
            <p>Parts of this series:</p>
            <ol>
              {props.series.parts.map((part) => {
                const pathname = `/blog/${props.series.slug}/${part.slug}`
                return (
                  <li key={part.slug}>
                    {location.pathname === pathname ? (
                      part.title
                    ) : (
                      <Link to={pathname}>{part.title}</Link>
                    )}
                  </li>
                )
              })}
            </ol>
            <hr />
          </>
        ) : null}

        <PostContent
          components={{
            Gitgraph,
            ProseImage,
            HotTip,
            Tweet,
            ESLintPrettierDiagram,
            ...prettyCodeComponents,
          }}
        />

        <div className="text-right">
          <a className="p-2" href="#top">
            Back to top ↑
          </a>
        </div>
      </main>

      {process.env.NODE_ENV === 'production' ? (
        <footer className="px-2.5">
          <hr />
          <script
            src="https://utteranc.es/client.js"
            // @ts-expect-error these are custom attributes for utterances
            repo="silvenon/silvenon.com"
            issue-term="title"
            theme={commentsTheme}
            crossOrigin="anonymous"
            async
          />
        </footer>
      ) : null}
    </Prose>
  )
}
