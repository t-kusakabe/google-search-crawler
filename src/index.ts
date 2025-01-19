import { chromium } from 'playwright';
import fs from 'fs';

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP',
  });
  const page = await context.newPage();

  await page.goto('https://takeout.google.com');

  const email: string = process.env.GOOGLE_EMAIL || '';
  await page.fill('input[type="email"]', email);

  await page.click('text=次へ');

  const password = process.env.GOOGLE_PASSWORD || '';
  await page.fill('input[type="password"]', password);

  await page.click('text=次へ');

  const cookies = await context.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies));

  await page.screenshot({ path: 'screenshots/screenshot.png' });

  await browser.close();
};

run().catch((error) => {
  // biome-ignore lint: Console log for testing
  console.error('Error running the crawler:', error);
});
