import { test, expect } from '@playwright/test'

test('app shell renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('app-shell')).toBeVisible()
})
