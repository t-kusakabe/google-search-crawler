import { chromium } from 'playwright';
import fs from 'fs';

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: process.env.USER_AGENT,
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP',
  });
  context.setDefaultTimeout(0);
  const page = await context.newPage();

  await page.goto('https://takeout.google.com');

  const email: string = process.env.GOOGLE_EMAIL || '';
  const emailInput = page.locator('input[type="email"]');
  await page.waitForTimeout(1000);
  await emailInput.pressSequentially(email, { delay: 100 + Math.random() * 300 });
  await page.click('text=次へ');

  const password = process.env.GOOGLE_PASSWORD || '';
  const passwordInput = page.locator('input[name="Passwd"]');
  await page.waitForTimeout(1000);
  await passwordInput.pressSequentially(password, { delay: 100 + Math.random() * 300 });
  await page.click('text=次へ');

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const cookies = await context.cookies();
  fs.writeFileSync('./data/cookies.json', JSON.stringify(cookies));

  await page.screenshot({ path: 'screenshots/screenshot.png' });

  await browser.close();
};

run().catch((error) => {
  // biome-ignore lint: Console log for testing
  console.error('Error running the crawler:', error);
});
