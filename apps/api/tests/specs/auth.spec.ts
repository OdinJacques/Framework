import { test, expect } from '../../src/fixtures/services.fixture';

test.describe('Auth API', () => {
  test('verifyLogin returns 404 for an account that does not exist', async ({ authService }) => {
    const result = await authService.verifyLogin('not-a-real-user@example.com', 'wrong-password');

    expect(result.responseCode).toBe(404);
    expect(result.message).toContain('not found');
  });
});
