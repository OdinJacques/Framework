import { expect } from '@wdio/globals';
import { SettingsHomePage } from '../../src/pages/settings-home.page';
import { NetworkInternetPage } from '../../src/pages/network-internet.page';

describe('Network & internet', () => {
  it('toggles airplane mode on and back off', async () => {
    const homePage = new SettingsHomePage();
    const networkPage = new NetworkInternetPage();

    await homePage.openNetworkInternet();

    const initialState = await networkPage.isAirplaneModeEnabled();
    await networkPage.toggleAirplaneMode();
    const toggledState = await networkPage.isAirplaneModeEnabled();
    expect(toggledState).not.toBe(initialState);

    // restore original state so the suite is idempotent across runs
    await networkPage.toggleAirplaneMode();
  });
});
