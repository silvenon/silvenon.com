const http = require('http')

const sizeOf = require('image-size')

function getImageSize(imgUrl) {
  return new Promise((resolve, reject) => {
    http
      // doesn't support HTTPS
      .get(new URL(imgUrl.replace('https', 'http')), function (response) {
        const chunks = []
        response
          .on('data', function (chunk) {
            chunks.push(chunk)
          })
          .on('end', function () {
            const buffer = Buffer.concat(chunks)
            resolve(sizeOf(buffer))
          })
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

module.exports = getImageSize
