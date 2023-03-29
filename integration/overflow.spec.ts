import { test, expect, devices } from '@playwright/test'

test.describe('overflow', () => {
  test('posts do not overflow horizontally', async ({ page }) => {
    await page.goto('/blog/checking-for-dead-urls')
    await page.setViewportSize(devices['iPhone SE'].viewport)

    const document = page.getByRole('document')

    const scrollWidth = await document.evaluate((doc) => doc.scrollWidth)
    const clientWidth = await document.evaluate((doc) => doc.clientWidth)

    expect(scrollWidth).toBe(clientWidth)
  })
})
