/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/*.test.{ts,tsx}'],
  future: {
    v2_routeConvention: true,
    unstable_tailwind: true,
    v2_meta: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
  },
  serverDependenciesToBundle: [
    /^micromark.*/,
    'decode-named-character-reference',
    'character-entities',
    /^mdx-bundler.*/,
  ],
}
