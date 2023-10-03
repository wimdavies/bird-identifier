export default async function filterScraper(page) {
  const filterResults = [];
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

    filterResults.push(...pageResults);

    const nextButtonSelector = '.pagination__link.next';
    const nextButtonExists = await page.$(nextButtonSelector);
    if (!nextButtonExists) break;

    await page.waitForSelector(nextButtonSelector);
    await page.click(nextButtonSelector);
    console.log('clicked next button');

    counter += 1;
  }

  console.log('Filter results:');
  console.log(filterResults);

  return filterResults;
}
