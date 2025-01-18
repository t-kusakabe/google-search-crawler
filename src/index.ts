import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://playwright.dev/docs/intro');

  await page.screenshot({ path: 'screenshots/screenshot.png' });

  await browser.close();
}

run().catch((error) => {
  // biome-ignore lint: Console log for testing
  console.error('Error running the crawler:', error);
});
