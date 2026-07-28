import { expect } from '@wdio/globals';
import { SettingsHomePage } from '../../src/pages/settingsHomePage';
import { NetworkInternetPage } from '../../src/pages/networkInternetPage';

describe('Network & internet', () => {
  it('toggles airplane mode on and back off', async () => {
    const homePage = new SettingsHomePage();
    const networkPage = new NetworkInternetPage();

    await homePage.openNetworkInternet();

    const initialState = await networkPage.isAirplaneModeEnabled();
    // Restoring in `finally` matters here: this suite runs unattended
    // (nightly/manual only), so a failed assertion must not leave airplane
    // mode toggled on for every subsequent run on the same emulator/device.
    try {
      await networkPage.toggleAirplaneMode();
      const toggledState = await networkPage.isAirplaneModeEnabled();
      expect(toggledState).not.toBe(initialState);
    } finally {
      const currentState = await networkPage.isAirplaneModeEnabled();
      if (currentState !== initialState) {
        await networkPage.toggleAirplaneMode();
      }
    }
  });
});
