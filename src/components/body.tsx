import React from 'react'
import styled, { css } from 'styled-components'
import { tint, shade } from 'polished'
import { mapKeys } from 'lodash'
import { camelCase } from 'change-case'
import Icon from './icon'
import typeset from './typeset'
import { bleed } from '../styles/mixins'

export const H1 = styled.h1`
  margin-bottom: 2rem;
  font-family: var(--alt-font-family);
  font-size: 1.85rem;
  font-weight: 900;
  line-height: 1.15;
  color: #000;
  @media ${(props) => props.theme.query.sm} {
    font-size: 3rem;
  }
`

const TypesetH2 = typeset<'h2'>('h2')
export const H2 = styled(TypesetH2)`
  margin-bottom: 1rem;
  font-family: var(--alt-font-family);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.5;
  color: #000;
  &.hanging-double-quotes {
    text-indent: -0.525em;
  }
  @media ${(props) => props.theme.query.sm} {
    font-size: 2.25rem;
  }
`

const TypesetH3 = typeset<'h3'>('h3')
export const H3 = styled(TypesetH3)`
  margin-bottom: 0.75rem;
  font-family: var(--base-font-family);
  font-size: 1.25rem;
  font-weight: normal;
  line-height: 1.25;
  color: #000;
  &.hanging-double-quotes {
    text-indent: -0.5em;
  }
  @media ${(props) => props.theme.query.sm} {
    font-size: 1.75rem;
  }
`

export const P = styled.p`
  margin-bottom: var(--spacing);
`

const StyledA = styled.a`
  color: ${(props) => props.theme.color.blue};
  text-decoration: underline;
  &:hover,
  &:focus {
    color: #000;
  }
`
const Autolink = styled(StyledA)`
  margin-right: 0.2em;
  svg {
    position: relative;
    top: -0.1rem;
  }
`
type AnchorProps = React.ComponentPropsWithoutRef<'a'> & {
  'data-autolink'?: boolean
  forwardedRef?: React.Ref<HTMLAnchorElement>
}
const Anchor = ({
  'data-autolink': dataAutolink = false,
  forwardedRef,
  ...props
}: AnchorProps) => {
  if (dataAutolink) {
    return (
      <Autolink ref={forwardedRef} {...props}>
        <Icon id="hash" size="0.6em" />
      </Autolink>
    )
  }
  return <StyledA ref={forwardedRef} {...props} />
}
const forwardRefFn = (
  props: AnchorProps,
  ref?: React.Ref<HTMLAnchorElement>,
) => <Anchor {...props} forwardedRef={ref} />
forwardRefFn.displayName = StyledA.displayName
export const A = React.forwardRef(forwardRefFn)

export const HR = styled.hr`
  display: block;
  max-width: 25rem;
  margin: 2rem auto;
  border: 0;
  border-bottom: 1px solid ${shade(0.75, '#fff')};
`

const listStyle = css`
  margin-bottom: 1rem;
  padding-left: 2rem;
  ul &,
  ol & {
    margin-bottom: 0;
  }
`
export const OL = styled.ol`
  ${listStyle};
`

export const UL = styled.ul`
  ${listStyle};
  list-style-type: disc;

  > li > ul {
    list-style-type: circle;

    > li > ul {
      list-style-type: square;
    }
  }
`

export const LI = styled.li`
  p {
    margin-bottom: 0.5rem;
    @media ${(props) => props.theme.query.sm} {
      margin-bottom: 0.75rem;
    }
  }
`

const TypesetBlockquote = typeset<'blockquote'>('blockquote')
export const Blockquote = styled(TypesetBlockquote)`
  position: relative;
  font-style: italic;
  font-size: 1.15rem;
  font-weight: 300;
  color: ${tint(0.5, '#000')};
  &.hanging-double-quotes {
    text-indent: -0.35em;
  }
  @media ${(props) => props.theme.query.sm} {
    padding-left: 1rem;
    font-size: 1.25rem;
  }
`

export const InlineCode = styled.code`
  padding: 0.25rem 0.35rem;
  background: ${shade(0.95, '#fff')};
  border-radius: var(--border-radius);
`

export const Pre = styled.pre.attrs(() => ({
  className: 'language-text',
}))`
  ${bleed};
  /* overriding Prism styles */
  margin-top: 0 !important;
  margin-bottom: var(--spacing) !important;
  padding: var(--site-padding) !important;

  -webkit-overflow-scrolling: touch;

  /**
    * 1. Make the element just wide enough to fit its content.
    * 2. Always fill the visible space in <pre>.
    */
  code {
    float: left; /* 1 */
    min-width: 100%; /* 2 */
  }

  /* highlighted line */
  .mdx-marker {
    --border-width: 0.25rem;
    display: block;
    margin-left: calc(var(--site-padding) * -1);
    margin-right: calc(var(--site-padding) * -1);
    padding-left: calc(var(--site-padding) - var(--border-width));
    padding-right: var(--site-padding);
    border-left: var(--border-width) solid ${(props) => props.theme.color.blue};
    background: hsl(0, 0%, 25%);
  }
`

export const Code = styled.code`
  /* TBD */
`

export const Figure = styled.figure`
  display: block;
  margin-bottom: 1rem;
`

export const Img = styled.img`
  display: block;
  margin-bottom: 1rem;
`

const components = {
  H1,
  H2,
  H3,
  H4: (): never => {
    throw new Error(`<h4> tag is missing from MDX components`)
  },
  H5: (): never => {
    throw new Error(`<h5> tag is missing from MDX components`)
  },
  H6: (): never => {
    throw new Error(`<h6> tag is missing from MDX components`)
  },
  P,
  A,
  HR,
  OL,
  UL,
  LI,
  Blockquote,
  Pre,
  InlineCode,
  Code,
  Figure,
  Img,
}

export const mdxComponents = mapKeys(components, (value, key) => camelCase(key))
