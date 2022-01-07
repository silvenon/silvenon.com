import { isValidElement } from 'react'
import { useDarkMode } from '~/services/dark-mode'

// https://github.com/atomiks/mdx-pretty-code#inline-highlighting
export function MDXSpan(props: {
  'data-mdx-pretty-code-fragment'?: string
  'data-mdx-pretty-code'?: boolean
  ['data-theme']?: 'light' | 'dark'
  ['data-color']?: string
  children?: React.ReactNode
}) {
  const darkMode = useDarkMode()

  if (typeof props['data-mdx-pretty-code-fragment'] !== 'undefined') {
    return <>{props.children}</>
  }

  if (props['data-mdx-pretty-code'] != null) {
    const children = isValidElement(props.children)
      ? props.children.props.children
      : props.children

    if (darkMode === null) {
      return (
        <code
          data-theme={props['data-theme']}
          style={{ color: props['data-color'] }}
        >
          {children}
        </code>
      )
    }

    if (
      (darkMode && props['data-theme'] === 'dark') ||
      (!darkMode && props['data-theme'] === 'light')
    ) {
      return <code style={{ color: props['data-color'] }}>{children}</code>
    }

    return null
  }

  return <span {...props} />
}

export function MDXPre(props: { children?: React.ReactNode }) {
  const darkMode = useDarkMode()

  if (isValidElement(props.children) && props.children.props['data-theme']) {
    if (
      (darkMode && props.children.props['data-theme'] === 'dark') ||
      (!darkMode && props.children.props['data-theme'] === 'light')
    ) {
      return <pre {...props} data-theme={props.children.props['data-theme']} />
    }

    return null
  }

  return <pre {...props} />
}
