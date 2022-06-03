import { test, expect } from '@playwright/test'

test.describe('HTTPS', () => {
  test('all routes have the Strict-Transport-Security header', async ({
    page,
  }) => {
    for (const route of [
      '/',
      '/about',
      '/blog/tailwind-and-separation-of-concerns',
    ]) {
      const [response] = await Promise.all([
        page.waitForEvent('response', async (response) => {
          const contentType = await response.headerValue('content-type')
          return contentType?.includes('text/html') || false
        }),
        // we only need to check the headers, so it's faster to just wait for the network response
        page.goto(route, { waitUntil: 'commit' }),
      ])
      expect(
        await response.headerValue('Strict-Transport-Security'),
        `Route "${route}" is missing the Strict-Transport-Security header`,
      ).not.toBeNull()
    }
  })
})
