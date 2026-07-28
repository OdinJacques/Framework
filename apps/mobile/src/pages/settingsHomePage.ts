import { BasePage } from './basePage';

/**
 * Locators target the stock Android 13 Settings app UI. Resource-ids and
 * text labels can shift between Android versions/OEM skins — adjust these
 * to match your emulator/device if an element fails to resolve.
 */
export class SettingsHomePage extends BasePage {
  private readonly networkInternetItem = '//android.widget.TextView[@text="Network & internet"]';
  private readonly searchIcon = '~Search settings';

  async openNetworkInternet(): Promise<void> {
    const item = await this.find(this.networkInternetItem);
    await item.click();
  }

  async openSearch(): Promise<void> {
    const icon = await this.find(this.searchIcon);
    await icon.click();
  }
}
