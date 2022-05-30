import { test, expect, devices } from '@playwright/test'

test.describe('overflow', () => {
  test('posts do not overflow horizontally', async ({ page }) => {
    await page.goto('/blog/checking-for-dead-urls')
    await page.setViewportSize(devices['iPhone SE'].viewport)

    const docHandle = await page.evaluateHandle(() => document.documentElement)
    const scrollWidth = await page.evaluate((doc) => doc.scrollWidth, docHandle)
    const clientWidth = await page.evaluate((doc) => doc.clientWidth, docHandle)

    expect(scrollWidth).toBe(clientWidth)

    await docHandle.dispose()
  })
})
