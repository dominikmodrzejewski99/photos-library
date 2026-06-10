import { test, expect } from '@playwright/test';

test.describe('Photos page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows a grid of photos after loading', async ({ page }) => {
    await expect(page.getByRole('button').first()).toBeVisible();
  });

  test('adds a photo to favorites and shows a snackbar', async ({ page }) => {
    await page.getByRole('button').first().click();
    await expect(page.locator('mat-snack-bar-container').last()).toContainText('Added to favorites');
  });

  test('shows "Already in favorites" when clicking the same photo twice', async ({ page }) => {
    const firstCard = page.getByRole('button').first();
    await firstCard.click();
    await expect(page.locator('mat-snack-bar-container').last()).toContainText('Added to favorites');
    await firstCard.click();
    await expect(page.locator('mat-snack-bar-container').last()).toContainText('Already in favorites');
  });
});
