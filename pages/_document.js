import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { extractCritical } from 'emotion-server'
import { TrackingCode } from '../components/tracking-code'
import { BIO } from '../constants'

class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const page = renderPage()
    const styles = extractCritical(page.html)
    return { ...page, ...styles }
  }

  constructor(props) {
    super(props)
    const { __NEXT_DATA__, ids } = props
    if (ids) {
      __NEXT_DATA__.ids = ids
    }
  }

  render() {
    const { css } = this.props
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <title>Matija Marohnić</title>
          <meta name="description" content={BIO} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/static/favicon.ico" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" />
          {/* eslint-disable react/no-danger */}
          <style dangerouslySetInnerHTML={{ __html: css }} />
          {/* eslint-enable react/no-danger */}
        </Head>
        <body>
          <Main />
          <NextScript />
          <TrackingCode />
        </body>
      </html>
    )
  }
}

export default MyDocument
