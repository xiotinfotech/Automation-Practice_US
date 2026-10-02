import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
});

test('standard user can log in and see Products', async ({ page }) => {
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('wrong password shows an error message', async ({ page }) => {
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Username and password do not match any user in this service',
  );
});

test('empty username shows a required error', async ({ page }) => {
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
});

test('locked out user sees the locked out error', async ({ page }) => {
  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Sorry, this user has been locked out',
  );
});