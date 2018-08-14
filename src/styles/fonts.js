// @flow
import WebFont from 'webfontloader'

if (WebFont.load != null) {
  WebFont.load({
    google: {
      families: ['Lora:400,400i,700:latin-ext'],
    },
  })
}
