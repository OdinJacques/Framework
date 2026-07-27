import { test, expect } from '../../src/fixtures/pages.fixture';

test.describe('Login', () => {
  test('shows an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('not-a-real-user@example.com', 'wrong-password');

    await expect.poll(() => loginPage.isLoginErrorVisible()).toBe(true);
  });
});
