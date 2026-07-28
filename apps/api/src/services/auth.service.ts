import { ApiClient } from '../clients/apiClient';

interface AuthResponseBody {
  responseCode: number;
  message: string;
}

export class AuthService {
  constructor(private readonly client: ApiClient) {}

  async verifyLogin(email: string, password: string): Promise<AuthResponseBody> {
    const response = await this.client.postForm('/verifyLogin', { email, password });
    return (await response.json()) as AuthResponseBody;
  }
}
