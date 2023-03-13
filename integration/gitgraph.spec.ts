import { test, expect } from '@playwright/test'

test.describe('Gitgraph', () => {
  test('renders graph of commits', async ({ page }) => {
    const graph = page.getByTestId('gitgraph').locator('svg').first()
    await page.goto('/blog/better-git-history/rebasing')
    await expect(graph).toBeVisible()
  })
})
