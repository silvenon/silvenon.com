import { isValidElement } from 'react'
import { useDarkMode } from '~/services/dark-mode'

// manages the HTML created by rehype-pretty-code because it light and dark theme
// https://rehype-pretty-code.netlify.app/

export { Span as span, Code as code, Pre as pre }

interface SpanProps extends React.ComponentProps<'span'> {
  'data-rehype-pretty-code-fragment'?: string
  'data-rehype-pretty-code'?: boolean
  ['data-theme']?: 'light' | 'dark'
  ['data-color']?: string
}

function Span(props: SpanProps) {
  const darkMode = useDarkMode()

  // converts the necessary "fragment" <span> into an actual fragment
  if (typeof props['data-rehype-pretty-code-fragment'] !== 'undefined') {
    return <>{props.children}</>
  }

  if (typeof props['data-rehype-pretty-code'] !== 'undefined') {
    const children = isValidElement(props.children)
      ? props.children.props.children
      : props.children

    if (darkMode === null) {
      return <code {...props} style={{ color: props['data-color'] }} />
    }

    if (
      (darkMode && props['data-theme'] === 'dark') ||
      (!darkMode && props['data-theme'] === 'light')
    ) {
      return <code style={{ color: props['data-color'] }}>{children}</code>
    }

    return <></>
  }

  return <span {...props} />
}

interface CodeProps extends React.ComponentProps<'code'> {
  'data-theme'?: 'light' | 'dark'
}

function Code(props: CodeProps) {
  const darkMode = useDarkMode()

  if (typeof props['data-theme'] !== 'undefined') {
    if (darkMode === null) {
      return <code {...props} />
    }

    if (
      (darkMode && props['data-theme'] === 'dark') ||
      (!darkMode && props['data-theme'] === 'light')
    ) {
      return <code {...props} />
    }

    return <></>
  }

  return <code {...props} />
}

interface PreProps extends React.ComponentProps<'pre'> {}

function Pre(props: PreProps) {
  const darkMode = useDarkMode()

  if (isValidElement(props.children) && props.children.props['data-theme']) {
    if (
      (darkMode && props.children.props['data-theme'] === 'dark') ||
      (!darkMode && props.children.props['data-theme'] === 'light')
    ) {
      return <pre {...props} data-theme={props.children.props['data-theme']} />
    }

    return <></>
  }

  return <pre {...props} />
}
