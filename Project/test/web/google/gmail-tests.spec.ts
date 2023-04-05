import { test, expect } from '@playwright/test';
import { TestBase } from '../../test-base';
import { Log } from '../../../src/libraries/console/log';
import { readCredentials } from '../../../src/fixtures/signin/credentials';
import { Random } from '../../../src/libraries/tools/random';

const testBase = new TestBase();
const log = new Log();
const baseUrl = 'https://www.google.com/';

test.beforeAll(async ({ page }) => {
  log.StepDescription(`Navigate to ${baseUrl}.`);
  await page.goto(baseUrl);
});

test('Compose and send an email', async ({ page }) => {
  await navigateToSignInPage(page);
  await signInToGmail(page);
  await composeAndSendEmail(page);
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

  const credentials = readCredentials();

  const emailAddressTextbox = page.getByRole('textbox', { name: 'Email or phone' });
  await emailAddressTextbox.fill(credentials.username);

  let nextButton = page.getByRole('button', { name: 'Next' });
  await nextButton.click();

  const passwordTextbox = page.getByRole('textbox', { name: 'Enter your password' });
  await passwordTextbox.fill(credentials.password);

  nextButton = page.getByRole('button', { name: 'Next' });
  await nextButton.click();
}

async function composeAndSendEmail(page) {
  log.StepDescription('Compose the test email.');
  const composeButton = page.getByRole('button', { name: 'Compose' });
  await composeButton.click();

  const toEmailAddressTextbox = page.getByRole('combobox');
  await toEmailAddressTextbox.click();
  await toEmailAddressTextbox.fill('bluemustardtest+abc@gmail.com');
  await toEmailAddressTextbox.press('Tab');
  
  const random = new Random();
  const subjectString = `This is a test - ${random.Alphanumeric(6)}`;
  const subjectTextbox = page.getByPlaceholder('Subject');
  await subjectTextbox.fill(subjectString);
  
  log.StepDescription('Send the email.');
  const sendButton = page.getByRole('button', { name: 'Send ‪(Ctrl-Enter)‬' });
  await sendButton.click();
}

test.afterEach(async ({ browser }) => {
  await testBase.Cleanup(browser);
});
