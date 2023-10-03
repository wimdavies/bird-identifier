import puppeteer from 'puppeteer';
import sizeOptionSelectors from '../utils/sizeOptionSelectors.js';
import filterScraper from '../utils/filterScraper.js';

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

  const sizeFilterSelector = '#tab-size';
  await page.waitForSelector(sizeFilterSelector);
  await page.click(sizeFilterSelector);
  console.log('entered size filter list dialog');

  const sameSizeAsRobinSelector = sizeOptionSelectors[1];
  await page.waitForSelector(sameSizeAsRobinSelector);
  await page.click(sameSizeAsRobinSelector);
  console.log('clicked "Same size as a robin" filter');

  const applyButtonSelector = '#panel-size > div.bird-identifier__options__submenu__footer > button.bird-identifier__options__submenu__footer__apply';
  await page.waitForSelector(applyButtonSelector);
  await page.click(applyButtonSelector);
  console.log('clicked "apply"');

  await filterScraper(page);

  await browser.close();
})();
