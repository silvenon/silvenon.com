import { Link, useLocation } from '@remix-run/react'
import { useCallback, useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import type { Theme as UtterancesTheme } from 'utterances-react-component'
import { Utterances } from 'utterances-react-component'
import Header from '~/components/Header'
import Prose from '~/components/Prose'
import PostDate from '~/components/PostDate'
import Gitgraph from '~/components/Gitgraph'
import Tweet from '~/components/Tweet'
import ProseImage from '~/components/ProseImage'
import HotTip from '~/components/HotTip'
import ESLintPrettierDiagram from '~/components/ESLintPrettierDiagram'
import { useDarkMode } from '~/services/dark-mode'
import unorphan from 'unorphan'

interface StandalonePost {
  slug: string
  title: string
  htmlTitle?: string
  published?: string
  lastModified?: string
  code: string
}

interface SeriesPart extends Omit<StandalonePost, 'slug' | 'published'> {
  seriesPart: number
  series: {
    slug: string
    title: string
    published?: string
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

  const isSeries = 'series' in props

  let commentsTheme: UtterancesTheme

  if (darkMode === null) {
    commentsTheme = 'preferred-color-scheme'
  } else if (darkMode) {
    commentsTheme = 'github-dark'
  } else {
    commentsTheme = 'github-light'
  }

  const unorphanRef = useCallback(
    (node: HTMLElement | null) => {
      if (node) unorphan(node)
    },
    // unorphan needs to be computed when these change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSeries],
  )

  return (
    <>
      <Header />
      <Prose className="space-y-4">
        <main>
          <article>
            {isSeries ? (
              <h1 className="space-y-2 text-center lg:space-y-4">
                <div>
                  <span ref={unorphanRef}>{props.series.title}</span>
                  <span className="sr-only">:</span>
                </div>
                <div className="text-[0.8em] font-normal dark:font-light">
                  {props.htmlTitle ? (
                    <span
                      ref={unorphanRef}
                      dangerouslySetInnerHTML={{ __html: props.htmlTitle }}
                    />
                  ) : (
                    <span ref={unorphanRef}>{props.title}</span>
                  )}
                </div>
              </h1>
            ) : (
              <h1 className="text-center">
                {props.htmlTitle ? (
                  <span
                    ref={unorphanRef}
                    dangerouslySetInnerHTML={{ __html: props.htmlTitle }}
                  />
                ) : (
                  <span ref={unorphanRef}>{props.title}</span>
                )}
              </h1>
            )}

            <PostDate
              published={
                (isSeries ? props.series.published : props.published) ??
                undefined
              }
              lastModified={props.lastModified}
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
              }}
            />

            <div className="text-right">
              <a className="p-2" href="#top">
                Back to top ↑
              </a>
            </div>
          </article>
        </main>

        <footer className="px-2.5">
          <hr className="!mb-2" />
          <Utterances
            key={
              isSeries ? `${props.series.slug}-${props.seriesPart}` : props.slug
            }
            repo="silvenon/silvenon.com"
            theme={commentsTheme}
            issueTerm="title"
          />
        </footer>
      </Prose>
    </>
  )
}
