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
  route('feed.rss', './routes/feed.ts', { id: 'routes/feed-rss' }),
  route('feed.atom', './routes/feed.ts', { id: 'routes/feed-atom' }),
  route('*', './routes/catchall.tsx'),
] satisfies RouteConfig
