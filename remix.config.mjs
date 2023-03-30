/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/*.test.{ts,tsx}'],
  future: {
    unstable_tailwind: true,
  },
  serverDependenciesToBundle: [
    /^micromark.*/,
    'decode-named-character-reference',
    'character-entities',
    /^mdx-bundler.*/,
  ],
}
