import puppeteer from 'puppeteer';
import declineCookies from './utils/declineCookies.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    // slowMo option slows all operations down to assist debugging
    slowMo: 100,
    args: [
      '--disable-infobars',
      '--start-maximized',
    ],
  });
  const page = await browser.newPage();
  await page.goto('https://www.rspb.org.uk/birds-and-wildlife/a-z');

  await declineCookies(page);

  const birdCardAnchorSelector = 'body > app-root > ng-component > app-layout-default > main > div > species-search > div > div > div.body.row > div.list > div.cards > rspb-card > article > a';
  const pageResults = await page.$$eval(birdCardAnchorSelector, (elements) => (
    elements.map((element) => ({
      commonName: element.innerText.split('\n')[0],
      latinName: element.innerText.split('\n')[1],
    }))
  ));
  console.log(pageResults);

  await page.screenshot({ path: 'screenshots/a-z_screenshot.png' });
  await browser.close();
})();
