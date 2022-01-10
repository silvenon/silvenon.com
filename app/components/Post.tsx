import { useLocation, Link } from 'remix'
import { useCallback } from 'react'
import unorphan from 'unorphan'
import Prose from './Prose'
import Icon from './Icon'
import { formatDate } from '../utils/date'
import { useDarkMode } from '../services/dark-mode'
import calendarIcon from '@iconify/icons-bx/bx-calendar'
import penIcon from '@iconify/icons-mdi/pen'

interface Props {
  seriesTitle?: string
  seriesPart?: number
  htmlTitle?: string
  title: string
  published?: string
  parts?: Array<{
    pathname: string
    title: string
  }>
  children: React.ReactNode
}

export default function Post({
  seriesTitle,
  seriesPart,
  htmlTitle,
  title,
  published,
  parts,
  children,
}: Props) {
  const location = useLocation()
  const darkMode = useDarkMode()
  const isSeries = seriesTitle && typeof seriesPart === 'number'

  const unorphanRef = useCallback(
    (node) => {
      if (node) unorphan(node)
    },
    // unorphan needs to be computed when these change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSeries, darkMode],
  )

  let commentsTheme = darkMode ? 'github-dark' : 'github-light'
  if (darkMode === null) {
    commentsTheme = 'preferred-color-scheme'
  }

  return (
    <>
      <Prose as="main" className="py-4 lg:mt-4">
        {isSeries ? (
          <h1 className="text-center space-y-2 lg:space-y-4">
            <div ref={unorphanRef}>{seriesTitle}</div>
            <div className="font-normal dark:font-light text-[0.8em]">
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

        {parts ? (
          <>
            <p>Parts of this series:</p>
            <ol>
              {parts.map((part) => (
                <li key={part.pathname}>
                  {part.pathname === location.pathname ? (
                    part.title
                  ) : (
                    <Link to={part.pathname}>{part.title}</Link>
                  )}
                </li>
              ))}
            </ol>
            <hr />
          </>
        ) : null}

        {children}

        {children ? (
          <div className="text-right">
            <a className="p-2" href="#top">
              Back to top ↑
            </a>
          </div>
        ) : null}
      </Prose>

      {process.env.NODE_ENV === 'production' ? (
        <footer className="px-2.5">
          <>
            {children ? <hr /> : null}
            <script
              src="https://utteranc.es/client.js"
              // @ts-expect-error these are custom attributes for utterances
              repo="silvenon/silvenon.com"
              issue-term="title"
              theme={commentsTheme}
              crossOrigin="anonymous"
              async
            />
          </>
        </footer>
      ) : null}
    </>
  )
}

export function PostDate({ published }: Pick<Props, 'published'>) {
  if (published) {
    return (
      <time
        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
        dateTime={published}
      >
        <Icon icon={calendarIcon} />
        <span>{formatDate(published)}</span>
      </time>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-300">
      <Icon icon={penIcon} />
      <span>Draft</span>
    </div>
  )
}
