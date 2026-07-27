import { expect } from '@wdio/globals';
import { SettingsHomePage } from '../../src/pages/settings-home.page';
import { SearchSettingsPage } from '../../src/pages/search-settings.page';

describe('Settings search', () => {
  it('finds a result when searching for "Wi-Fi"', async () => {
    const homePage = new SettingsHomePage();
    const searchPage = new SearchSettingsPage();

    await homePage.openSearch();
    await searchPage.search('Wi-Fi');

    const results = await searchPage.getResultTitles();
    expect(results.length).toBeGreaterThan(0);
  });
});
