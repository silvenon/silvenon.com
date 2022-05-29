import { test, expect } from '@playwright/test'

test.describe('routes', () => {
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
})
