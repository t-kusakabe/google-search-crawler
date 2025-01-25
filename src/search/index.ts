import { chromium } from 'playwright';
import fs from 'fs';
import csv from 'csv-parser';

const run = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: process.env.USER_AGENT,
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP',
  });

  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
  await context.addCookies(cookies);

  const page = await context.newPage();

  const keywords = await readCsv();

  for (const keyword of keywords) {
    console.log(keyword['keyword']);

    await page.goto('https://www.google.com');

    await page.locator('textarea[title="検索"]').waitFor()
    const searchInput = page.locator('textarea[title="検索"]');
    await searchInput.pressSequentially(keyword['keyword'], { delay: 100 + Math.random() * 300 });

    await page.keyboard.press('Enter');

    await page.locator('#rcnt').waitFor();

    const sponsors = page.locator('.uEierd');
    await page.waitForTimeout(2000 + Math.random() * 2000);

    const cnt = await sponsors.count()
    console.log(cnt);
  }
};

const readCsv = async (): Promise<Record<string, string>[]> => {
  return new Promise((resolve) => {
    const keywords: Record<string, string>[] = [];
    fs.createReadStream('./keywords.csv')
      .pipe(csv())
      .on('data', (data) => keywords.push(data))
      .on('end', () => resolve(keywords));
  });
};

run().catch((error) => {
  // biome-ignore lint: Console log for testing
  console.error('Error running the crawler:', error);
});
