import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('Photos button navigates to the photos page', async ({ page }) => {
    await page.goto('/favorites');
    await page.getByRole('link', { name: 'Photos' }).click();
    await expect(page).toHaveURL('/');
  });

  test('Favorites button navigates to the favorites page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Favorites' }).click();
    await expect(page).toHaveURL('/favorites');
  });

  test('page title is "Photos" on the photos page', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.title === 'Photos');
    await expect(page).toHaveTitle('Photos');
  });

  test('page title is "Favorites" on the favorites page', async ({ page }) => {
    await page.goto('/favorites');
    await page.waitForFunction(() => document.title === 'Favorites');
    await expect(page).toHaveTitle('Favorites');
  });
});
