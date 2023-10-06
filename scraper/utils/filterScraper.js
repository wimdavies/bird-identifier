export default async function filterScraper(page) {
  const filterResults = [];
  let counter = 1;

  while (true) {
    const resultsPage1ButtonSelector = '#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > div > div > div > div.pagination--compact > div.pagination__numbers > a:nth-child(1)';
    const isResultsPage1ButtonSelector = await page.$(resultsPage1ButtonSelector);
    const firstImgSrcSelector = '#main-content > div > div:nth-child(2) > div > div.bird-identifier > div.bird-identifier__panel > form > div:nth-child(2) > div > div > div > div.row > a > div > figure > picture > img';
    const isFirstImgSrcSelector = await page.$(firstImgSrcSelector);

    if (isResultsPage1ButtonSelector && !isFirstImgSrcSelector) {
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

    filterResults.push(...pageResults);

    const nextButtonSelector = '.pagination__link.next';
    const isNextButton = await page.$(nextButtonSelector);
    if (!isNextButton) break;

    await page.waitForSelector(nextButtonSelector);
    console.log('waited for next button');
    await page.$eval(nextButtonSelector, (element) => element.click());
    console.log('clicked next button');

    counter += 1;
  }

  console.log('Filter results:');
  console.log(filterResults);

  return filterResults;
}
