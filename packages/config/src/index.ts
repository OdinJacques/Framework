import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const envSchema = z.object({
  WEB_BASE_URL: z.string().url().default('https://automationexercise.com'),
  API_BASE_URL: z.string().url().default('https://automationexercise.com/api/'),
  DEMO_USER_NAME: z.string().default('Framework QA'),
  DEMO_USER_EMAIL: z.string().email().default('framework.qa.demo@example.com'),
  DEMO_USER_PASSWORD: z.string().default('ChangeMe123!'),
  APPIUM_HOST: z.string().default('localhost'),
  APPIUM_PORT: z.coerce.number().default(4723),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
