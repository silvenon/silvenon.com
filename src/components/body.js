// @flow
import styled from 'astroturf'
import typeset from './typeset'

export const H1 = styled.h1`
  margin-bottom: 2rem;
  font-family: var(--alt-font-family);
  font-size: 1.75rem;
  font-weight: 900;
  line-height: 1.15;
  color: #000;
  @media (--min-small) {
    font-size: 3rem;
  }
`

const TypesetH2 = typeset('h2')
export const H2 = styled(TypesetH2)`
  margin-bottom: 1rem;
  font-family: var(--alt-font-family);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  color: #000;
  &:--hanging-double-quotes {
    text-indent: -0.525em;
  }
  @media (--min-small) {
    font-size: 2.25rem;
  }
`

const TypesetH3 = typeset('h3')
export const H3 = styled(TypesetH3)`
  margin-bottom: 0.75rem;
  font-family: var(--base-font-family);
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.25;
  font-style: italic;
  letter-spacing: 1px;
  color: #000;
  &:--hanging-double-quotes {
    text-indent: -0.5em;
  }
  @media (--min-small) {
    font-size: 1.5rem;
  }
`

export const P = styled.p`
  margin-bottom: var(--margin-bottom);
`

export const A = styled.a`
  color: var(--blue);
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
  border-bottom: 1px solid color(#000 a(25%));
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
  p {
    margin-bottom: 0.5rem;
    @media (--min-small) {
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
  color: color(#000 tint(50%));
  &:--hanging-double-quotes {
    text-indent: -0.35em;
  }
  @media (--min-small) {
    padding-left: 1rem;
    font-size: 1.25rem;
  }
`

export const Code = styled.code`
  padding: 0.25rem 0.35rem;
  white-space: nowrap;
  background: color(#000 a(5%));
  border-radius: var(--border-radius);
`

export const Pre = styled.pre`
  overflow: visible;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 1rem;
  background: color(#000 a(5%));
  /* matching specificity from Prism theme */
  &,
  &[class*='language-'] {
    margin: 0 calc(var(--site-padding) * -1);
    margin-bottom: var(--margin-bottom);
    border-radius: 0;
    @media (--min-large) {
      margin-left: 0;
      margin-right: 0;
      border-radius: var(--border-radius);
    }
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
