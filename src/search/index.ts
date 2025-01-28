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

  const cookies = JSON.parse(fs.readFileSync('./data/cookies.json', 'utf-8'));
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

    await page.locator('#rcnt').waitFor({ timeout: 100000 });

    await page.evaluate(() => {
      return Object.fromEntries(
        Array.from({ length: localStorage.length })
          .map((_, index) => {
            const key: string = localStorage.key(index) as string;
            return [key, localStorage.getItem(key)];
          })
      );
    });

    const sponsors = await page.locator('.uEierd > div > div > div').elementHandles();
    await page.waitForTimeout(3000);

    if (sponsors.length === 0) {
      console.log('No sponsors');
      continue;
    }
    console.log(sponsors.length);

    for (const sponsor of sponsors) {
      const title = await sponsor.$('div > a > div > span > span > span > div > span');
      if (title) {
        const str = await title.innerText();
        console.log(`title: ${str}`);
      }

      const anchor = await sponsor.$('div > a')
      if (anchor) {
        const href = await anchor.getAttribute('href');
        console.log(`link: ${href}`);
      }

    }

    await page.waitForTimeout(10000 + Math.random() * 3000);
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
