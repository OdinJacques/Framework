import { BasePage } from './base.page';

export class NetworkInternetPage extends BasePage {
  private readonly airplaneModeSwitch =
    '//android.widget.TextView[@text="Airplane mode"]/parent::*//android.widget.Switch';

  async isAirplaneModeEnabled(): Promise<boolean> {
    const toggle = await this.find(this.airplaneModeSwitch);
    return (await toggle.getAttribute('checked')) === 'true';
  }

  async toggleAirplaneMode(): Promise<void> {
    const toggle = await this.find(this.airplaneModeSwitch);
    await toggle.click();
  }
}
