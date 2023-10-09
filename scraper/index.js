/* eslint-disable no-restricted-syntax */
import puppeteer from 'puppeteer';
import sizeOptionSelectors from './utils/sizeOptionSelectors.js';
import declineCookies from './utils/declineCookies.js';
import filterScraper from './utils/filterScraper.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    // slowMo option slows all operations down to assist debugging
    slowMo: 50,
    args: [
      '--disable-infobars',
      '--start-maximized',
    ],
  });
  const page = await browser.newPage();
  await page.goto('https://www.rspb.org.uk/birds-and-wildlife/wildlife-guides/identify-a-bird/');

  await declineCookies(page);

  const scrapedBirds = [];

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

    // Control flow to rescue inconsistent behaviour
    // Now realised this arises from issue with website, not scraper
    // TODO: replace this with error handling involving a page reload
    const resultsPage1ButtonSelector = '#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > div > div > div > div.pagination--compact > div.pagination__numbers > a:nth-child(1)';
    const isResultsPage1ButtonSelectorActive = await page.$('#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > div > div > div > div.pagination--compact > div.pagination__numbers > a.pagination__link.active');
    const firstImgSrcSelector = '#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > div > div > div > div.row > a > div > figure > picture > img';
    const isFirstImgSrcSelector = await page.$(firstImgSrcSelector);

    if (!isResultsPage1ButtonSelectorActive && !isFirstImgSrcSelector) {
      console.log('The results have NOT loaded in the expected way');
      await page.waitForSelector(resultsPage1ButtonSelector);
      console.log('waited for results page 1 button to load');
      await page.$eval(resultsPage1ButtonSelector, (element) => element.click());
      console.log('clicked results page 1 button');
      await page.waitForSelector(firstImgSrcSelector);
      console.log('waited for first result image to load');
    } else {
      console.log('The results have loaded in the expected way');
      await page.waitForSelector(firstImgSrcSelector);
      console.log('waited for first result image to load');
    }

    const filterResults = await filterScraper(page);

    scrapedBirds.push(...filterResults);
    // console.log('Scraped birds so far:');
    // console.log(scrapedBirds);

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
