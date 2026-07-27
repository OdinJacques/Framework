import { $, $$ } from '@wdio/globals';

export abstract class BasePage {
  protected async find(selector: string, timeoutMs = 10000) {
    const element = await $(selector);
    await element.waitForDisplayed({ timeout: timeoutMs });
    return element;
  }

  protected async findAll(selector: string) {
    return $$(selector);
  }
}
