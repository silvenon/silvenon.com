const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redirects = [
  { from: '/intro-to-eslint', to: 'https://blog.silvenon.com/intro-to-eslint-81f6c9f24ce5' },
  { from: '/testing-react-and-redux', to: 'https://semaphoreci.com/community/series/how-to-test-a-react-and-redux-application-with-ava' },
  { from: '/testing-react-and-redux-pt1', to: 'https://semaphoreci.com/community/tutorials/getting-started-with-create-react-app-and-ava' },
  { from: '/testing-react-and-redux-pt2', to: 'https://semaphoreci.com/community/tutorials/testing-common-redux-patterns-in-react-using-ava' },
  { from: '/testing-react-and-redux-pt3', to: 'https://semaphoreci.com/community/tutorials/testing-react-components-with-ava' },
]

app.prepare().then(() => {
  const server = express()

  redirects.forEach(({ from, to }) => {
    server.get(from, (req, res) => {
      res.redirect(301, to)
    })
  })

  server.get('*', (req, res) => {
    handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    // eslint-disable-next-line no-console
    console.log('> Ready on http://localhost:3000')
  })
})
