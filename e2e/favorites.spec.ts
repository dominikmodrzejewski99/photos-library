import { test, expect } from '@playwright/test';

test.describe('Favorites page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows empty state when there are no favorites', async ({ page }) => {
    await page.getByRole('link', { name: 'Favorites' }).click();
    await expect(page.getByText('No favorites yet')).toBeVisible();
  });

  test('shows added photo in the favorites list', async ({ page }) => {
    await page.getByRole('button').first().click();
    await page.getByRole('link', { name: 'Favorites' }).click();
    const cards = page.getByRole('button');
    await expect(cards.first()).toBeVisible();
  });

  test('clicking a favorite photo opens the detail page with the large image', async ({ page }) => {
    await page.getByRole('button').first().click();
    await page.getByRole('link', { name: 'Favorites' }).click();
    await page.getByRole('button').first().click();
    await expect(page).toHaveURL(/\/photos\/\d+/);
    await expect(page.getByRole('img')).toBeVisible();
    await expect(page.getByRole('button', { name: /remove.*favorites/i })).toBeVisible();
  });

  test('Remove from favorites returns to Favorites page', async ({ page }) => {
    await page.getByRole('button').first().click();
    await page.getByRole('link', { name: 'Favorites' }).click();
    await page.getByRole('button').first().click();
    await page.getByRole('button', { name: /remove.*favorites/i }).click();
    await expect(page).toHaveURL('/favorites');
  });
});
