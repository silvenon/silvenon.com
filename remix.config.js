/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: 'vercel',
  server:
    !process.env.VERCEL || process.env.NODE_ENV === 'development'
      ? undefined
      : './server.js',
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/*.test.{ts,tsx}'],
  serverDependenciesToBundle: [
    /^micromark.*/,
    'decode-named-character-reference',
    'character-entities',
    /^mdx-bundler.*/,
  ],
}
