import { Browser, test } from '@playwright/test';
import { Log } from '../src/libraries/console/log';

const log = new Log();

export class TestBase {
    async Cleanup(browser: Browser) {
        const contexts = browser.contexts();

        log.StepDescription("Close browser.");
        for (const context of contexts) {
            await context.close();
        }
    }
}

test.beforeAll(async ({ page }) => {
    log.HeaderText();
});

test.afterAll(async ({ page }) => {
    log.FooterText();
});

export default test;