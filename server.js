import { createRequestHandler } from '@remix-run/vercel'
import * as build from '@remix-run/dev/server-build'
import {
  createMetronomeGetLoadContext,
  registerMetronome,
} from '@metronome-sh/vercel'

const buildWithMetronome = registerMetronome(build)
const metronomeGetLoadContext = createMetronomeGetLoadContext(
  buildWithMetronome,
  { config: require('./metronome.config.js') },
)

export default createRequestHandler({
  build,
  getLoadContext: metronomeGetLoadContext,
  mode: process.env.NODE_ENV,
})
