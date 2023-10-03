import puppeteer from 'puppeteer';

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

  const sameSizeAsRobinSelector = '#panel-size > div.bird-identifier__options__submenu__container > li:nth-child(4) > label';
  await page.waitForSelector(sameSizeAsRobinSelector);
  await page.click(sameSizeAsRobinSelector);
  console.log('clicked "Same size as a robin" filter');

  const applyButtonSelector = '#panel-size > div.bird-identifier__options__submenu__footer > button.bird-identifier__options__submenu__footer__apply';
  await page.waitForSelector(applyButtonSelector);
  await page.click(applyButtonSelector);
  console.log('clicked "apply"');

  const resultsData = [];
  let counter = 1;

  while (true) {
    const firstImgSrcSelector = '#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > div > div > div > div.row > a > div > figure > picture > img';
    await page.waitForSelector(firstImgSrcSelector);
    console.log('waited for results to load');

    const pageResults = await page.$$eval(
      '#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > div > div > div > div.row > a',
      (elements) => elements.map((element) => ({
        name: element.innerText,
        aToZLink: element.href,
        modalLink: `https://www.rspb.org.uk${element.getAttribute('data-href')}`,
        image: `https://www.rspb.org.uk${element.querySelector('#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > div > div > div > div.row > a > div > figure > picture > img').getAttribute('data-srcset')}`,
      })),
    );
    console.log(pageResults);
    console.log(`Captured ${counter}th page of data`);

    resultsData.push(...pageResults);

    const nextButtonSelector = '.pagination__link.next';
    const nextButtonExists = await page.$(nextButtonSelector);
    if (!nextButtonExists) break;

    await page.waitForSelector(nextButtonSelector);
    await page.click(nextButtonSelector);
    console.log('clicked next button');

    counter += 1;
  }

  console.log(resultsData);

  await browser.close();
})();
