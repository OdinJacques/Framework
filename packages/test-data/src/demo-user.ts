import { env } from '@framework/config';
import type { User } from '@framework/shared-types';

/**
 * Shared demo user consumed by both the web login flow and the API auth
 * endpoints (/api/login, /api/verifyLogin). Must exist on automationexercise.com
 * before suites run — create it once via the site's signup flow and set the
 * matching values in .env (see .env.example).
 */
export const demoUser: User = {
  name: env.DEMO_USER_NAME,
  email: env.DEMO_USER_EMAIL,
  password: env.DEMO_USER_PASSWORD,
};
