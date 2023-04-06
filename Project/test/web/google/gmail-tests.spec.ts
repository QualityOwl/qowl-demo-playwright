import { test, expect } from '@playwright/test';
import { TestBase } from '../../test-base';
import { Log } from '../../../src/libraries/console/log';
import { readCredentials } from '../../../src/fixtures/signin/credentials';
import { Random } from '../../../src/libraries/tools/random';
import { assert } from 'console';

const testBase = new TestBase();
const log = new Log();
const random = new Random();
const credentials = readCredentials();
const baseUrl = 'https://www.google.com/';
const subjectString = `This is a test ${random.Alphanumeric(6)}`;

test.beforeAll(async ({ page }) => {
  log.StepDescription(`Navigate to ${baseUrl}.`);
  await page.goto(baseUrl);
});

test('Compose and send an email', async ({ page }) => {
  await navigateToSignInPage(page);
  await signInToGmail(page);
  await composeAndSendEmail(page);
  await validateEmailIsDisplayed(page, true);
});

async function navigateToSignInPage(page) {
  log.StepDescription("Navigate to the 'Gmail' signin page.");

  const googleAppsButton = page.getByRole('button', { name: 'Google apps' });
  await googleAppsButton.click();

  const gmailButton = page.frameLocator('iframe[name="app"]').getByRole('link', { name: 'Gmail' });
  await gmailButton.click();
}

async function signInToGmail(page) {
  log.StepDescription('Sign in to \'Gmail\' account.');

  const signInButton = page.getByRole('link', { name: 'Sign in' });
  await signInButton.click();

  const emailAddressTextbox = page.getByRole('textbox', { name: 'Email or phone' });
  await emailAddressTextbox.fill(credentials.emailAddress);

  const nextButtonEmail = page.locator('#identifierNext');
  await nextButtonEmail.click();

  const passwordTextbox = page.getByRole('textbox', { name: 'Enter your password' });
  await passwordTextbox.fill(credentials.password);

  const nextButtonPassword = page.locator('#passwordNext')
  await nextButtonPassword.click();
}

async function composeAndSendEmail(page) {
  log.StepDescription('Compose the test email.');
  const composeButton = page.getByRole('button', { name: 'Compose' });
  await composeButton.click();

  const toEmailAddressTextbox = page.getByRole('combobox');
  await toEmailAddressTextbox.click();
  await toEmailAddressTextbox.fill(credentials.emailAddress);
  await toEmailAddressTextbox.press('Tab');

  const subjectTextbox = page.getByPlaceholder('Subject');
  await subjectTextbox.fill(subjectString);

  log.StepDescription('Send the email.');
  const sendButton = page.getByRole('button', { name: 'Send ‪(Ctrl-Enter)‬' });
  await sendButton.click();
  await expect(page.getByText('Message sent')).toHaveCount(1);
}

async function validateEmailIsDisplayed(page, isDisplayed: boolean) {
  log.StepDescription(`Validate email is ${isDisplayed ? 'received' : 'deleted'}.`);
  const expectedEmailRow = page.getByRole('link', { name: subjectString });
  await expect(expectedEmailRow).toHaveCount((isDisplayed ? 1 : 0));
}

async function clearInbox(page) {
  log.StepDescription('Clear the inbox.');
  const selectAllCheckbox = page.getByRole('button', { name: 'Select' }).getByRole('checkbox');
  await selectAllCheckbox.click();

  const deleteButton = page.getByRole('button', { name: 'Delete' });
  await deleteButton.click();

  await validateEmailIsDisplayed(page, false);
  const confirmationMessage = page.locator(':text-matches("moved to Trash")');
  await expect(confirmationMessage).toHaveCount(1);

  const inboxMessage = page.getByText('Your Primary tab is empty.');
  await expect(inboxMessage).toHaveCount(1);
}

test.afterEach(async ({ page, browser }) => {
  await clearInbox(page);
  await testBase.Cleanup(browser);
});