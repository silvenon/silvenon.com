import { test, expect } from '@playwright/test'

test.describe('dark mode', () => {
  test('toggle in UI', async ({ page }) => {
    const document = page.getByRole('document')
    const enableSwitch = page.getByRole('switch', { name: 'Enable dark mode' })
    const disableSwitch = page.getByRole('switch', {
      name: 'Disable dark mode',
    })
    const resetBtn = page.getByRole('button', { name: 'Reset to OS' })

    await page.emulateMedia({ colorScheme: 'light' })

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

  test('toggle in OS', async ({ page }) => {
    const document = page.getByRole('document')

    await page.goto('/')

    await page.emulateMedia({ colorScheme: 'light' })
    await expect(document).not.toHaveClass(/dark/)

    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(document).toHaveClass(/dark/)

    await page.emulateMedia({ colorScheme: 'light' })
    await expect(document).not.toHaveClass(/dark/)
  })

  test.describe('hydration error', () => {
    for (const [pageName, route] of [
      ['home', '/'],
      ['blog post', '/blog/e2e-testing-with-cypress-vs-playwright'],
    ]) {
      for (const colorScheme of ['light', 'dark'] as const) {
        test(`${colorScheme} mode on ${pageName} page`, async ({ page }) => {
          const msgs: string[] = []
          page.on('console', (msg) => {
            if (msg.type() === 'error' && /did not match/i.test(msg.text())) {
              msgs.push(msg.text())
            }
          })
          await page.emulateMedia({ colorScheme })
          await page.goto(route)
          expect(msgs, msgs.join('\n\n')).toHaveLength(0)
        })
      }
    }
  })
})
