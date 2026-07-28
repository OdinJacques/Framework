import { test, expect } from '../../src/fixtures/services.fixture';

test.describe('Auth API', () => {
  test('verifyLogin returns 404 for an account that does not exist', async ({ authService }) => {
    const result = await authService.verifyLogin('not-a-real-user@example.com', 'wrong-password');

    // responseCode is the API's structured, stable contract — the primary
    // check. message is human-readable copy the site could reword at any
    // time, so only assert it's present rather than matching exact wording.
    expect(result.responseCode).toBe(404);
    expect(result.message.length).toBeGreaterThan(0);
  });
});
