import puppeteer from 'puppeteer';
import * as fs from 'fs';
import declineCookies from './utils/declineCookies.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: null,
    // slowMo option slows all operations down to assist debugging
    slowMo: 100,
    args: [
      '--disable-infobars',
      '--start-maximized',
    ],
  });
  const page = await browser.newPage();
  // sets User Agent to potentially avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

  await page.goto('https://www.rspb.org.uk/birds-and-wildlife/a-z');

  await declineCookies(page);

  const allResults = [];

  while (true) {
    const currentPageNumberSelector = 'button.button.current.ng-star-inserted';
    await page.waitForSelector(currentPageNumberSelector);
    const currentPageNumber = await page.$eval(
      currentPageNumberSelector,
      (element) => element.innerText,
    );

    const birdCardAnchorSelector = 'body > app-root > ng-component > app-layout-default > main > div > species-search > div > div > div.body.row > div.list > div.cards > rspb-card > article > a';
    const pageResults = await page.$$eval(birdCardAnchorSelector, (elements) => (
      elements.map((element) => ({
        commonName: element.innerText.split('\n')[0],
        scientificName: element.innerText.split('\n')[1],
        link: element.href,
      }))
    ));
    console.log(`Page ${currentPageNumber} results:`);
    console.log(pageResults);

    allResults.push(...pageResults);

    const nextButtonSelector = 'button.next.button';
    const isNextButton = await page.$(nextButtonSelector);
    if (!isNextButton) {
      console.log("Can't find a next page button, going to break the loop now");
      break;
    }
    await page.waitForSelector(nextButtonSelector);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click(nextButtonSelector),
    ]);
  }

  console.log('All bird results:');
  console.log(allResults);
  console.log(`Number of birds found: ${allResults.length}`);

  fs.writeFile('./file-output/birdResults.json', JSON.stringify(allResults), (err) => console.log(err));

  await browser.close();
})();
