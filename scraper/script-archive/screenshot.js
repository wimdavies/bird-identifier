import { launch } from 'puppeteer';

(async () => {
  const browser = await launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.rspb.org.uk/birds-and-wildlife/wildlife-guides/identify-a-bird/');
  await page.screenshot({ path: 'scraper/screenshots/landing_screenshot.png' });
  await browser.close();
})();
