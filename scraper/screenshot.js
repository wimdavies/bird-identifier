const puppeteer = require('puppeteer');

(async () => {
 const browser = await puppeteer.launch({headless: 'new'});
 const page = await browser.newPage();
 await page.goto('https://www.rspb.org.uk/birds-and-wildlife/wildlife-guides/identify-a-bird/');
 await page.screenshot({path: 'screenshot.png'});
await browser.close();
})();