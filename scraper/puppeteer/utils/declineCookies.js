export default async function declineCookies(page) {
  const editCookiesButtonSelector = '.ng-tns-c105-0.btn-light.btn-narrow';
  const saveCookieSettingsButtonSelector = 'body > app-root > ng-component > app-layout-default > rspb-cookie-banner > div.options.ng-tns-c105-0.ng-trigger.ng-trigger-contentExpansion > button';

  await page.waitForSelector(editCookiesButtonSelector);
  await page.click(editCookiesButtonSelector);
  console.log('Clicked edit cookie settings');

  await page.waitForSelector(saveCookieSettingsButtonSelector);
  // using $eval because page.click could not find element
  await page.$eval(saveCookieSettingsButtonSelector, (element) => element.click());
  console.log('Clicked save cookie settings');
}
