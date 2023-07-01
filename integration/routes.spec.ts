import { test, expect } from '@playwright/test'

test.describe('routes', () => {
  test('https', async ({ page }) => {
    for (const route of ['/', '/blog/tailwind-and-separation-of-concerns']) {
      const response = await page.goto(route, { waitUntil: 'commit' })
      expect(
        await response?.headerValue('Strict-Transport-Security'),
        `Route "${route}" is missing the Strict-Transport-Security header`,
      ).not.toBeNull()
    }
  })

  test('blog post', async ({ page }) => {
    const pageTitle = page.getByRole('heading', { level: 1 })
    await page.goto('/blog/intro-to-eslint')
    await expect(pageTitle).toHaveText(/Intro to ESLint/)
  })

  test('not found', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 })
    const navigation = page.getByRole('navigation')
    await page.goto('/non-existent-page')
    await expect(page).toHaveTitle('Page not found')
    await expect(heading).toHaveText('Nothing found at this URL.')
    await expect(navigation).not.toBeVisible()
    await page.goto('/blog/non-existent-post')
    await expect(page).toHaveTitle('Post not found')
    await expect(heading).toHaveText('Post not found')
    await page.goto('/blog/no-existent-series/non-existent-part')
    await expect(page).toHaveTitle('Post not found')
    await expect(heading).toHaveText('Post not found')
    await expect(navigation).not.toBeVisible()
  })

  test('redirects', async ({ page }) => {
    await page.goto('/intro-to-eslint')
    await expect(page).toHaveURL('/blog/intro-to-eslint')
    await page.goto('/blog/intro-to-eslint-81f6c9f24ce5')
    await expect(page).toHaveURL('/blog/intro-to-eslint')
    await page.goto('/blog/mocking-modules-with-jest')
    await expect(page).toHaveURL('/blog/mocking-with-jest/modules')
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

    const assertCanonical = async (url: string) => {
      await expect(canonical).toHaveAttribute('href', url)
      await expect(ogUrl).toHaveAttribute('content', url)
    }

    await page.goto('/')
    await assertCanonical('http://localhost:3000/')

    await page.goto('/blog/intro-to-eslint/')
    await assertCanonical('http://localhost:3000/blog/intro-to-eslint')

    await page.goto('/?param=bla')
    await assertCanonical('http://localhost:3000/?param=bla')
  })
})
