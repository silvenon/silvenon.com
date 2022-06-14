import { test, expect } from '@playwright/test'

test.describe('routes', () => {
  test('https', async ({ page }) => {
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

  test('blog post', async ({ page }) => {
    await page.goto('/blog/intro-to-eslint')
    await expect(
      page.locator('role=heading[name=/Intro to ESLint/]'),
    ).toBeVisible()
  })

  test('not found', async ({ page }) => {
    await page.goto('/blog')
    await expect(
      page.locator('role=heading[name="Page Not Found"]'),
    ).toBeVisible()
    await page.goto('/blog/non-existent-post')
    await expect(
      page.locator('role=heading[name="Post Not Found"]'),
    ).toBeVisible()
  })

  test('redirects', async ({ page }) => {
    await page.goto('/intro-to-eslint')
    await expect(page).toHaveURL('/blog/intro-to-eslint')
    await page.goto('/blog/intro-to-eslint/')
    await expect(page).toHaveURL('/blog/intro-to-eslint')
    await page.goto('/blog/intro-to-eslint/?param=bla')
    await expect(page).toHaveURL('/blog/intro-to-eslint?param=bla')
    await page.goto('/blog/better-git-history')
    await expect(page).toHaveURL('/blog/better-git-history/introduction')
  })

  test('canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel=canonical]')
    const ogUrl = page.locator('meta[property="og:url"]')

    await page.goto('/')
    await expect(canonical).toHaveAttribute('href', 'http://localhost:3000/')
    await expect(ogUrl).toHaveAttribute('content', 'http://localhost:3000/')

    await page.goto('/blog/intro-to-eslint/')
    await expect(canonical).toHaveAttribute(
      'href',
      'http://localhost:3000/blog/intro-to-eslint',
    )
    await expect(ogUrl).toHaveAttribute(
      'content',
      'http://localhost:3000/blog/intro-to-eslint',
    )
  })
})
