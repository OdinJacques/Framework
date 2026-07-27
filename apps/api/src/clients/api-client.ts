import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Thin wrapper over Playwright's APIRequestContext for automationexercise.com's
 * REST API, which expects POST bodies as x-www-form-urlencoded rather than JSON.
 *
 * Paths are normalized to strip a leading slash before being combined with
 * `baseURL`. Per WHATWG URL resolution (which APIRequestContext follows), a
 * leading-slash path resolves as an absolute path on the origin and silently
 * drops the `/api` segment of the base URL — e.g. baseURL
 * `https://automationexercise.com/api/` + path `/productsList` resolves to
 * `https://automationexercise.com/productsList`, not `.../api/productsList`.
 */
function normalize(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path;
}

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(path: string): Promise<APIResponse> {
    return this.request.get(normalize(path));
  }

  async postForm(path: string, form: Record<string, string>): Promise<APIResponse> {
    return this.request.post(normalize(path), { form });
  }

  async putForm(path: string, form: Record<string, string>): Promise<APIResponse> {
    return this.request.put(normalize(path), { form });
  }

  async deleteForm(path: string, form: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(normalize(path), { form });
  }
}
