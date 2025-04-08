import { test, expect } from '@playwright/test';
import { TestBase } from '../../test-base';
import { Log } from '../../../common/logging/log';

class SearchTests extends TestBase {
  log: Log;
  baseUrl: string;

  constructor() {
    super(); // Call the TestBase constructor
    this.log = new Log();
    this.baseUrl = 'https:www.bing.com/';
  }
}

test.describe('Bing Search Tests', () => {
  const searchTests = new SearchTests();

  test.beforeEach(async ({ page }) => {
    searchTests.log.Step(`Navigate to \'${searchTests.baseUrl}\'.`);
    await page.goto(searchTests.baseUrl);
  });

  test('Search For \'Saturn V\' Wikipedia Page.', async ({ page }) => {
    // arrange
    const searchTerm = 'saturn five rocket on wikipedia';
    const resultLinkName = 'Saturn V - Wikipedia';
    const resultPageName = 'Saturn V';

    searchTests.log.Step(`Enter \'${searchTerm}\' as the search term.`);
    const searchField = await page.getByRole('textbox', { name: 'characters out of' });
    await searchField.click();
    await searchField.type(searchTerm, { delay: 50 })

    searchTests.log.Step('Press \'Enter\' key.');
    await searchField.press('Enter');

    searchTests.log.Step(`Click the \'${resultLinkName}\' link on the results page.`);
    const [newTab] = await Promise.all
      (
        [
          page.context().waitForEvent('page'), // waits for the new tab
          page.getByRole('link', { name: resultLinkName }).first().click() // clicks link to open new tab
        ]
      );
    await newTab.waitForLoadState('domcontentloaded');

    searchTests.log.Step(`Validate that the \'${resultPageName}\' page is displayed.`);
    const headingText = newTab.getByRole('heading', { name: resultPageName, level: 1 });
    await expect(headingText).toHaveCount(1);
    searchTests.log.Step(`Heading text is '${await headingText.innerText()}'.`);
  });

  test.afterEach(async ({ browser }) => {
    await searchTests.Cleanup(browser);
  });
});