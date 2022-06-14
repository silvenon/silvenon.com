import { test, expect } from '@playwright/test'

test.describe('Gitgraph', () => {
  test('renders graph of commits', async ({ page }) => {
    const graph = page.locator('[data-testid=gitgraph] >> svg').first()
    await page.goto('/blog/better-git-history/rebasing')
    await expect(graph).toBeVisible()
  })
})
