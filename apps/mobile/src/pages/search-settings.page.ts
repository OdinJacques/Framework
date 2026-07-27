import { BasePage } from './base.page';

export class SearchSettingsPage extends BasePage {
  private readonly searchInput = 'id=com.android.settings:id/search_src_text';
  private readonly resultTitles = '//android.widget.TextView[@resource-id="android:id/title"]';

  async search(term: string): Promise<void> {
    const input = await this.find(this.searchInput);
    await input.setValue(term);
  }

  async getResultTitles(): Promise<string[]> {
    const items = await this.findAll(this.resultTitles);
    const titles: string[] = [];
    for (const item of items) {
      titles.push(await item.getText());
    }
    return titles;
  }
}
