import { chromium } from 'playwright';

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'ja-JP',
  });
  const page = await context.newPage();

  await page.goto('https://takeout.google.com');
  
  const email: string = process.env.GOOGLE_EMAIL || '';
  await page.fill('input[type="email"]', email);

  await page.click('text=次へ');

  await page.screenshot({ path: 'screenshots/screenshot.png' });

  await browser.close();
};

run().catch((error) => {
  // biome-ignore lint: Console log for testing
  console.error('Error running the crawler:', error);
});
