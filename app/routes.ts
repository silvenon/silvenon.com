import {
  type RouteConfig,
  index,
  route,
  prefix,
} from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  ...prefix('blog', [
    route(':postSlug', './routes/post-standalone.tsx'),
    route(':seriesSlug/:postSlug', './routes/post-series.tsx'),
  ]),
  route('dark-mode', './routes/dark-mode.ts'),
  route('feed.rss', './routes/rss-feed.ts'),
  route('*', './routes/catchall.tsx'),
] satisfies RouteConfig
