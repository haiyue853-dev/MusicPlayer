import { test, expect } from '@playwright/test'

test('shell has sidebar content and bottom player', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('sidebar')).toBeVisible()
  await expect(page.getByTestId('main-content')).toBeVisible()
  await expect(page.getByTestId('bottom-player')).toBeVisible()
})
