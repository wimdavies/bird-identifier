/* eslint-disable no-restricted-syntax */
import puppeteer from 'puppeteer';
import sizeOptionSelectors from './utils/sizeOptionSelectors.js';
import filterScraper from './utils/filterScraper.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 100,
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

  for (const sizeOptionSelector of sizeOptionSelectors) {
    console.log('top of loop');

    const sizeFilterSelector = '#tab-size';
    await page.waitForSelector(sizeFilterSelector);
    console.log('waited for size filter button');
    await page.$eval(sizeFilterSelector, (element) => element.click());
    console.log('entered size filter list dialog');

    await page.waitForSelector(sizeOptionSelector);
    console.log('waited for size option button');
    await page.$eval(sizeOptionSelector, (element) => element.click());
    console.log('clicked size option');

    const applyButtonSelector = '#panel-size > div.bird-identifier__options__submenu__footer > button.bird-identifier__options__submenu__footer__apply';
    await page.waitForSelector(applyButtonSelector);
    console.log('waited for apply button');
    await page.$eval(applyButtonSelector, (element) => element.click());
    console.log('clicked "apply"');

    const filterResults = await filterScraper(page);

    scrapedBirds.push(...filterResults);
    console.log('Scraped birds so far:');
    console.log(scrapedBirds);

    const clearAllOptionsSelector = '#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > ul > div > button.bird-identifier__fixed-bottom__current-indicator__item.clear';
    await page.waitForSelector(clearAllOptionsSelector);
    console.log('waited for current option button');
    await page.$eval(clearAllOptionsSelector, (element) => element.click());
    console.log('cleared current filter option');
  }

  console.log('Final scraped birds:');
  console.log(scrapedBirds);

  await browser.close();
})();
