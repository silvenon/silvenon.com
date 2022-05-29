import { test, expect } from '@playwright/test'

test.describe('dark mode', () => {
  test('toggle', async ({ page }) => {
    page.emulateMedia({ colorScheme: 'light' })

    await page.goto('/')

    await expect(page.locator('role=document')).not.toHaveClass(/dark/)
    await expect(
      page.locator('role=button[name="Reset to OS"]'),
    ).not.toBeVisible()

    await page.locator('role=switch[name="Enable dark mode"]').click()
    await expect(page.locator('role=document')).toHaveClass(/dark/)
    await expect(page.locator('role=button[name="Reset to OS"]')).toBeVisible()
    await page.locator('role=switch[name="Disable dark mode"]').click()
    await expect(page.locator('role=document')).not.toHaveClass(/dark/)
    await expect(page.locator('role=button[name="Reset to OS"]')).toBeVisible()

    await page.locator('role=switch[name="Enable dark mode"]').click()
    await expect(page.locator('role=document')).toHaveClass(/dark/)
    await page.reload()
    await expect(page.locator('role=document')).toHaveClass(/dark/)
    await expect(page.locator('role=button[name="Reset to OS"]')).toBeVisible()

    await page.locator('role=button[name="Reset to OS"]').click()
    await expect(page.locator('role=document')).not.toHaveClass(/dark/)
    await expect(
      page.locator('role=button[name="Reset to OS"]'),
    ).not.toBeVisible()

    await page.reload()
    await expect(page.locator('role=document')).not.toHaveClass(/dark/)
    await expect(
      page.locator('role=button[name="Reset to OS"]'),
    ).not.toBeVisible()
  })
})
