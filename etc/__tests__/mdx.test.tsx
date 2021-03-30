import React from 'react'
import compileMdx from '@mdx-js/mdx'
import { mdx } from '@mdx-js/react'
import { renderToString } from 'react-dom/server'
import dedent from 'dedent'
import { transform as babelTransform } from '@babel/core'
import { mdxOptions } from '../mdx'

// https://github.com/mdx-js/mdx/blob/d140f95eca338a4f4722b095278f021c6c248f45/packages/react/test/test.js

async function getMdxComponent(mdxContent: string, options: any) {
  // Turn the serialized MDX code into serialized JSX…
  const jsxContent = await compileMdx(mdxContent, {
    skipExport: true,
    ...options,
  })

  // …and that into serialized JS.
  const result = babelTransform(jsxContent, {
    configFile: false,
    plugins: [
      '@babel/plugin-transform-react-jsx',
      'babel-plugin-remove-export-keywords',
    ],
  })

  if (result) {
    // …and finally run it, returning the component.
    return new Function('mdx', `${result.code}; return MDXContent`)(mdx)
  }
}

describe('MDX processor', () => {
  test('output', async () => {
    const MDXComponent = await getMdxComponent(
      dedent`
        Introduction to my post with smart -- punctuation.

        ## Section

        ~~~js{2}
        function doSomething() {
          console.log('hello')
        }
        ~~~

        [[tip | Hot tip!]]
        | Content.
        |
        | More content.
      `,
      mdxOptions,
    )

    const template = document.createElement('template')
    template.innerHTML = renderToString(<MDXComponent />)
    expect(template.content).toMatchSnapshot()
  })
})
