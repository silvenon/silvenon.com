import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const method = import.meta.env.PROD ? ReactDOM.hydrate : ReactDOM.render
const postContentEl = document.querySelector('.post-content')

method(
  <App postHtmlContent={postContentEl?.innerHTML} />,
  document.querySelector('#app'),
)
