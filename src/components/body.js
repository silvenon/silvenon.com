// @flow
import styled from 'react-emotion'
import { lighten, transparentize } from 'polished'
import typeset, { hangingDoubleQuotes } from './typeset'
import rule from '../images/rule.svg'

export const H1 = styled.h1`
  margin-bottom: 2rem;
  font-family: ${props => props.theme.fontFamily.alt};
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.15;
  color: #000;
  ${props => props.theme.mqMin.sm} {
    font-size: 3rem;
  }
`

const TypesetH2 = typeset('h2')
export const H2 = styled(TypesetH2)`
  margin-bottom: 1rem;
  font-family: ${props => props.theme.fontFamily.alt};
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.25;
  color: #000;
  &.${hangingDoubleQuotes} {
    text-indent: -0.525em;
  }
  ${props => props.theme.mqMin.sm} {
    font-size: 2.25rem;
  }
`

const TypesetH3 = typeset('h3')
export const H3 = styled(TypesetH3)`
  margin-bottom: 0.75rem;
  font-family: ${props => props.theme.fontFamily.alt};
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.15;
  text-transform: lowercase;
  font-variant: small-caps;
  letter-spacing: 1px;
  color: #000;
  &.${hangingDoubleQuotes} {
    text-indent: -0.5em;
  }
  ${props => props.theme.mqMin.sm} {
    font-size: 1.75rem;
  }
`

export const P = styled.p`
  margin-bottom: 1rem;
  ${props => props.theme.mqMin.sm} {
    margin-bottom: 1.5rem;
  }
`

export const A = styled.a`
  color: ${props => props.theme.colors.blue};
  text-decoration: underline;
  &:hover,
  &:focus {
    color: #000;
  }
`

export const HR = styled.hr`
  display: block;
  max-width: 25rem;
  margin: 2rem auto;
  border: 0;
  border-bottom: 1px solid ${transparentize(0.75, '#000')};
  /* background: url('${rule}') center / 281px 19px repeat-x; */
`

export const OL = styled.ol`
  margin-bottom: 1rem;
  padding-left: 2rem;
`

export const UL = styled.ul`
  margin-bottom: 1rem;
  padding-left: 2rem;
  list-style-type: disc;
`

export const LI = styled.li`
  ${P} {
    margin-bottom: 0.5rem;
    ${props => props.theme.mqMin.sm} {
      margin-bottom: 0.75rem;
    }
  }
`

const TypesetBlockquote = typeset('blockquote')
export const Blockquote = styled(TypesetBlockquote)`
  position: relative;
  font-style: italic;
  font-size: 1.15rem;
  font-weight: 300;
  color: ${lighten(0.5, '#000')};
  &.${hangingDoubleQuotes} {
    text-indent: -0.5em;
  }
  ${props => props.theme.mqMin.sm} {
    padding-left: 1rem;
    font-size: 1.25rem;
  }
`

export const Code = styled.code`
  padding: 0.25rem 0.35rem;
  white-space: nowrap;
  background: ${transparentize(0.95, '#000')};
  border-radius: ${props => props.theme.borderRadius};
`

export const Pre = styled.pre`
  overflow: visible;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -${props => props.theme.sitePadding} 1rem !important;
  padding: 1rem;
  background: ${transparentize(0.95, '#000')};
  border-radius: 0 !important;
  ${props => props.theme.mqMin.sm} {
    margin-bottom: 1.5rem;
  }
  ${props => props.theme.mqMin.lg} {
    margin: 0 0 1rem !important;
    border-radius: ${props => props.theme.borderRadius} !important;
  }
`

export const Figure = styled.figure`
  display: block;
  margin-bottom: 1rem;
`

export const Img = styled.img`
  display: block;
  margin-bottom: 1rem;
`

export const components = {
  H1,
  H2,
  H3,
  H4: () => {
    throw new Error(`<h4> tag is missing from MDX components`)
  },
  H5: () => {
    throw new Error(`<h5> tag is missing from MDX components`)
  },
  H6: () => {
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
  InlineCode: Code,
  Figure,
  Img,
}
