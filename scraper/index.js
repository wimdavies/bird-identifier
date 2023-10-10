import puppeteer from 'puppeteer';

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
  await page.goto('https://www.rspb.org.uk/birds-and-wildlife/a-z');
  await page.screenshot({ path: 'screenshots/a-z_screenshot.png' });
  await browser.close();
})();
