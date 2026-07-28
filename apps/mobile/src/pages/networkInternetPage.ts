import { browser } from '@wdio/globals';
import { BasePage } from './basePage';

export class NetworkInternetPage extends BasePage {
  private readonly airplaneModeSwitch =
    '//android.widget.TextView[@text="Airplane mode"]/parent::*//android.widget.Switch';

  /**
   * Waits for the row to render, then resolves to exactly one match and
   * fails loudly with a diagnostic message otherwise, instead of silently
   * grabbing whichever switch a bare `$()` finds first — if the row's
   * container ever nests more than one toggle, that would otherwise mean
   * toggling the wrong setting without any error. Spreads the WDIO
   * ChainablePromiseArray into a plain array first: its own `.length` is a
   * `Promise<number>`, not a plain number, which trips up naive comparisons.
   */
  private async getAirplaneModeSwitch(timeoutMs = 10000) {
    await browser.waitUntil(
      async () => {
        const elements = [...(await this.findAll(this.airplaneModeSwitch))];
        return elements.length > 0;
      },
      { timeout: timeoutMs, timeoutMsg: 'The "Airplane mode" switch never appeared' },
    );

    const matches = [...(await this.findAll(this.airplaneModeSwitch))];
    if (matches.length !== 1) {
      throw new Error(
        `Expected exactly 1 "Airplane mode" switch, found ${matches.length}. The Settings UI likely ` +
          'changed on this Android version/OEM skin — update the locator in networkInternetPage.ts.',
      );
    }
    return matches[0];
  }

  async isAirplaneModeEnabled(): Promise<boolean> {
    const toggle = await this.getAirplaneModeSwitch();
    return (await toggle.getAttribute('checked')) === 'true';
  }

  async toggleAirplaneMode(): Promise<void> {
    const toggle = await this.getAirplaneModeSwitch();
    await toggle.click();
  }
}
