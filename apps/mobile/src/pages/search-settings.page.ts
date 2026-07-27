import { browser } from '@wdio/globals';
import { BasePage } from './base.page';

export class SearchSettingsPage extends BasePage {
  private readonly searchInput = 'id=com.android.settings:id/search_src_text';
  private readonly resultTitles = '//android.widget.TextView[@resource-id="android:id/title"]';

  async search(term: string): Promise<void> {
    const input = await this.find(this.searchInput);
    await input.setValue(term);
  }

  async getResultTitles(timeoutMs = 10000): Promise<string[]> {
    // Results render asynchronously after setValue(); without this wait, a
    // cold/slow emulator can return an empty list before results populate,
    // which looks identical to "search is broken" in the report.
    await browser.waitUntil(
      async () => {
        const length = await (await this.findAll(this.resultTitles)).length;
        return length > 0;
      },
      {
        timeout: timeoutMs,
        timeoutMsg: 'No search results appeared in Settings within the timeout',
      },
    );

    const items = await this.findAll(this.resultTitles);
    const titles: string[] = [];
    for (const item of items) {
      titles.push(await item.getText());
    }
    return titles;
  }
}
