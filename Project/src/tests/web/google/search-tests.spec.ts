import { test, expect } from '@playwright/test';
import { TestBase } from '../../../libraries/core/test-base';
import { Log } from '../../../libraries/console/log';

const testBase = new TestBase();
const log = new Log();
const baseUrl = 'https://www.google.com/';

test.beforeAll(async ({ page }) => {
  log.StepDescription('Navigate to the base URL.');
  await page.goto(baseUrl);
});

test('Search For \'Saturn V\'.', async ({ page }) => {
  log.StepDescription('Enter search term.');
  const searchField = await page.getByRole('combobox', { name: 'Search' });
  await searchField.click();
  await searchField.fill('saturn five rocket');
  await searchField.press('Enter');

  log.StepDescription('Click the link on the results page.');
  await page.waitForNavigation();
  await page.getByRole('link', { name: 'Saturn V Wikipedia https://en.wikipedia.org › wiki › Saturn_V' }).click();

  log.StepDescription('Assert the displayed page.');
  await expect(page.getByRole('heading', { name: 'Saturn V', exact: true })).toHaveCount(1);
});

test.afterEach(async ({ browser }) => {
  await testBase.Cleanup(browser);
});