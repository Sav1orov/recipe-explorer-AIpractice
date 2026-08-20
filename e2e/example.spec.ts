import { test, expect } from '@playwright/test'

test('фильтрует рецепты по названию', async ({ page }) => {
  await page.goto('./')

  const cards = page.locator('.recipe-card')
  await expect(cards.first()).toBeVisible()

  const firstRecipeName = await cards.first().getByRole('heading').innerText()

  await page.getByRole('searchbox', { name: 'Search recipes' }).fill(firstRecipeName)

  await expect(cards).toHaveCount(1)
  await expect(cards.first()).toContainText(firstRecipeName)
})

test('показывает ошибку при неудачном запросе', async ({ page }) => {
  await page.route('**/recipes?limit=30', async (route) => {
    await route.fulfill({
      status: 500,
      body: 'Server error',
    })
  })

  await page.goto('./')

  const errorMessage = page.getByRole('alert')

  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toContainText('Recipes could not be loaded')
})

test('сохраняет избранный рецепт после перезагрузки', async ({ page }) => {
  await page.goto('./')

  const cards = page.locator('.recipe-card')
  await expect(cards.first()).toBeVisible()

  const firstRecipeName = await cards.first().getByRole('heading').innerText()

  await cards
    .first()
    .getByRole('button', {
      name: `Add ${firstRecipeName} to favorites`,
    })
    .click()

  await page.reload()

  await page.getByRole('button', { name: /Favorites/ }).click()

  await expect(cards).toHaveCount(1)
  await expect(cards.first()).toContainText(firstRecipeName)
})
