import { chromium } from 'playwright';
import fs from 'fs';

const run = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP',
  });

  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
  await context.addCookies(cookies);

  const page = await context.newPage();
  await page.goto('https://www.google.com');
};

run().catch((error) => {
  // biome-ignore lint: Console log for testing
  console.error('Error running the crawler:', error);
});
