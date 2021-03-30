import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const method = import.meta.env.PROD ? ReactDOM.hydrate : ReactDOM.render

method(<App />, document.querySelector('#app'))
