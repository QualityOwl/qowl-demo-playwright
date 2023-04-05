import { test, expect } from '@playwright/test';
import { TestBase } from '../../../libraries/core/test-base';

const testBase = new TestBase();
const baseUrl = 'https://www.google.com/';

test.beforeAll(async ({ page }) => {
  console.log('Navigate to the base URL.');
  await page.goto(baseUrl);
});

test('Log Into Gmail.', async ({ page }) => {
  await page.getByRole('button', { name: 'Google apps' }).click();
  await page.frameLocator('iframe[name="app"]').getByRole('link', { name: 'Gmail' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email or phone' }).fill('bluemustardtest@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Password1@');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Compose' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('combobox').fill('bluemustardtest+abc@gmail.com');
  await page.getByRole('combobox').press('Tab');
  await page.getByPlaceholder('Subject').fill('This is a test - XYZ987');
  await page.getByRole('button', { name: 'Send ‪(Ctrl-Enter)‬' }).click();
});

test.afterEach(async ({ browser }) => {
  await testBase.Cleanup(browser);
});