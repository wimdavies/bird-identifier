export default async function declineCookies(page) {
  const editCookieSettingsButtonSelector = 'body > div.cookie-preferences > div > div:nth-child(2) > div.col-12.col-md-12.col-lg-12.cookie-preferences__default-action-wrapper > div.cookie-preferences__edit-settings > a';
  const saveCookieSettingsButtonSelector = 'body > div.cookie-preferences.cookie-preferences__open > div > div.row.cookie-preferences__options-toggle > div.col-12.col-md-12.col-lg-12.cookie-preferences__save-action-wrapper > div > a';

  await page.waitForSelector(editCookieSettingsButtonSelector);
  await page.click(editCookieSettingsButtonSelector);
  console.log('Editing cookie settings');

  await page.waitForSelector(saveCookieSettingsButtonSelector);
  await page.click(saveCookieSettingsButtonSelector);
  console.log('Saved cookie settings');
}
