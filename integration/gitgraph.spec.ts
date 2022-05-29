import { test, expect } from '@playwright/test'

test.describe('Gitgraph', () => {
  test('renders graph of commits', async ({ page }) => {
    await page.goto('/blog/better-git-history/rebasing')
    await expect(
      page.locator('[data-testid=gitgraph] >> svg').first(),
    ).toBeVisible()
  })
})
