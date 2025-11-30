import { test, expect } from '@playwright/test';
import { fillLoginCredentials, logIn, openLoginForm } from './helpers.ts';

const baseUrl = 'http://localhost:5173/'

test('has title', async ({ page }) => {
  await page.goto(baseUrl);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Smarty Party');
});

test('login menu expands', async ({ page }) => {
  await page.goto(baseUrl);

  await openLoginForm(page);

  await expect(page.getByText('LoginUsernamePasswordSubmit')).toBeVisible();
});

test('login', async ({ page }) => {
  await page.goto(baseUrl);
  await openLoginForm(page);
  await fillLoginCredentials(page);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('User logged in successfully!')).toBeVisible();
});

test('user panel expands', async ({ page }) => {
  await page.goto(baseUrl);
  await logIn(page);
  await page.getByRole('button', { name: 'admin' }).click();
  await expect(page.getByText('admin@test.comProfileCreate')).toBeVisible();
});

test('has rooms list', async ({ page }) => {
  await page.goto(baseUrl);
  await logIn(page);
  await expect(page.getByText('RoomsNameCreatorTopicStatusActions')).toBeVisible();
});

test('has create room form', async ({ page }) => {
  await page.goto(baseUrl);
  await logIn(page);
  await expect(page.locator('div').filter({ hasText: 'NameTopicGeneral' }).nth(5)).toBeVisible();
});