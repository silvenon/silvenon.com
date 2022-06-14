import { test, expect } from '@playwright/test'

test.describe('dark mode', () => {
  test('toggle', async ({ page }) => {
    const document = page.locator('role=document')
    const enableSwitch = page.locator('role=switch[name="Enable dark mode"]')
    const disableSwitch = page.locator('role=switch[name="Disable dark mode"]')
    const resetBtn = page.locator('role=button[name="Reset to OS"]')

    page.emulateMedia({ colorScheme: 'light' })

    await page.goto('/')

    await expect(document).not.toHaveClass(/dark/)
    await expect(resetBtn).not.toBeVisible()

    await enableSwitch.click()
    await expect(document).toHaveClass(/dark/)
    await expect(resetBtn).toBeVisible()
    await disableSwitch.click()
    await expect(document).not.toHaveClass(/dark/)
    await expect(resetBtn).toBeVisible()

    await enableSwitch.click()
    await expect(document).toHaveClass(/dark/)
    await page.reload()
    await expect(document).toHaveClass(/dark/)
    await expect(resetBtn).toBeVisible()

    await resetBtn.click()
    await expect(document).not.toHaveClass(/dark/)
    await expect(resetBtn).not.toBeVisible()

    await page.reload()
    await expect(document).not.toHaveClass(/dark/)
    await expect(resetBtn).not.toBeVisible()
  })
})
