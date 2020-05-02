import React from 'react'
import Head from 'next/head'
import { createGlobalStyle } from 'styled-components'
import FontFaceObserver from 'fontfaceobserver'
import { toPairs } from 'lodash'

const webFonts = {
  lora: 'Lora',
  inconsolata: 'Inconsolata',
}

const useWebFonts = async () => {
  React.useEffect(() => {
    toPairs(webFonts).forEach(async ([id, name]) => {
      const font = new FontFaceObserver(name)
      await font.load()
      document.documentElement.classList.add(`loaded-${id}`)
    })
  }, [])
}

const CustomProperties = createGlobalStyle`
  .loaded-lora {
    :root {
      --base-font-family: Lora, Georgia, Times, "Times New Roman", serif;
    }
  }

  .loaded-inconsolata {
    :root {
      --code-font-family: Inconsolata, Monaco, Consolas, "Courier New", Courier, monospace;
    }
  }

  :root {
    --base-font-family: Georgia, Times, "Times New Roman", serif;
    --alt-font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    --code-font-family: Monaco, Consolas, "Courier New", Courier, monospace;

    --base-font-size: 18px;
    --code-font-size: 1em;
    --line-height: 1.75;

    --site-padding: 1rem;
    --spacing: 1rem;
    --border-radius: 0.5rem;

    --z-header: 1;
    --z-github-corner: 2;

    --logo-width: 2rem;
    --logo-height: 2rem;

    --search-transition-duration: 0.3s;

    @media ${(props) => props.theme.query.sm} {
      --base-font-size: 20px;

      --spacing: 1.5rem;

      --logo-width: 3rem;
      --logo-height: 3rem;
    }
  }
`

const CustomPropertiesWithFonts = () => {
  useWebFonts()

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inconsolata|Lora:400,400i,700&display=swap&subset=latin-ext"
        />
      </Head>
      <CustomProperties />
    </>
  )
}

export default CustomPropertiesWithFonts
