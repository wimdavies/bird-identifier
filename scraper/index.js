import puppeteer from 'puppeteer';
import sizeOptionSelectors from './utils/sizeOptionSelectors.js';
import filterScraper from './utils/filterScraper.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--disable-infobars',
      '--start-maximized',
    ],
  });
  const page = await browser.newPage();
  await page.goto('https://www.rspb.org.uk/birds-and-wildlife/wildlife-guides/identify-a-bird/');

  const cookieAcceptSelector = 'body > div.cookie-preferences > div > div:nth-child(2) > div.col-12.col-md-12.col-lg-12.cookie-preferences__default-action-wrapper > div.cookie-preferences__default-action > a';
  await page.waitForSelector(cookieAcceptSelector);
  console.log('ready to accept cookies');
  await page.click(cookieAcceptSelector);
  console.log('accepted cookies!');

  const scrapedBirds = [];

  // TODO: loop inside which each filter is applied, filterScraper called, and filter cleared

  console.log(scrapedBirds);

  await browser.close();
})();
