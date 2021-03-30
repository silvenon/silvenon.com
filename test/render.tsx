import React from 'react'
import { render } from '@testing-library/react'
import {
  Router,
  createHistory,
  createMemorySource,
  LocationProvider,
} from '@reach/router'

/* https://testing-library.com/docs/example-reach-router/ */

export function renderWithLocation(
  ui: React.ReactNode,
  { route = '/', history = createHistory(createMemorySource(route)) } = {},
) {
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  }
}

export function renderWithRouter(
  ui: React.ReactNode,
  { route = '/', history = createHistory(createMemorySource(route)) } = {},
) {
  return {
    ...render(
      <LocationProvider history={history}>
        <Router>{ui}</Router>
      </LocationProvider>,
    ),
    history,
  }
}
