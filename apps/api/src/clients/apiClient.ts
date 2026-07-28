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

// Shorter than the 30s test timeout, so a hung request fails with an
// attributable request-timeout message instead of the generic
// "Test timeout of 30000ms exceeded".
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Fails fast with a clear message on a non-2xx response, instead of letting
 * callers hit a cryptic `SyntaxError: Unexpected token` from `.json()` when
 * the server returns an HTML error page (e.g. a 500) instead of JSON.
 */
async function assertOk(response: APIResponse, method: string, path: string): Promise<APIResponse> {
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(
      `API request failed: ${method} ${normalize(path)} -> ${response.status()} ${response.statusText()}\n${body.slice(0, 500)}`,
    );
  }
  return response;
}

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(path: string): Promise<APIResponse> {
    const response = await this.request.get(normalize(path), { timeout: REQUEST_TIMEOUT_MS });
    return assertOk(response, 'GET', path);
  }

  async postForm(path: string, form: Record<string, string>): Promise<APIResponse> {
    const response = await this.request.post(normalize(path), { form, timeout: REQUEST_TIMEOUT_MS });
    return assertOk(response, 'POST', path);
  }

  async putForm(path: string, form: Record<string, string>): Promise<APIResponse> {
    const response = await this.request.put(normalize(path), { form, timeout: REQUEST_TIMEOUT_MS });
    return assertOk(response, 'PUT', path);
  }

  async deleteForm(path: string, form: Record<string, string>): Promise<APIResponse> {
    const response = await this.request.delete(normalize(path), { form, timeout: REQUEST_TIMEOUT_MS });
    return assertOk(response, 'DELETE', path);
  }
}
