import * as crypto from 'crypto';

export class AuthService {
  private pkceStore = new Map<string, string>();
  private readonly AUTH_DOMAIN = "https://us-east-1l8xttvvw4.auth.us-east-1.amazoncognito.com";
  private readonly CLIENT_ID = "7huhicf17qof5kq3hhrf9knca7";
  private readonly REDIRECT_URI = "http://localhost:4200/";

  private base64URLEncode(buffer: Buffer): string {
    return buffer
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  private sha256(buffer: Buffer): Buffer {
    return crypto.createHash("sha256").update(buffer).digest();
  }

  generatePKCE(): { codeVerifier: string; codeChallenge: string } {
    const codeVerifier = this.base64URLEncode(crypto.randomBytes(32));
    const codeChallenge = this.base64URLEncode(this.sha256(Buffer.from(codeVerifier)));
    this.pkceStore.set("current", codeVerifier);
    return { codeVerifier, codeChallenge };
  }

  getAuthUrl(codeChallenge: string): string {
    return `${this.AUTH_DOMAIN}/oauth2/authorize` +
      `?client_id=${this.CLIENT_ID}` +
      `&response_type=code` +
      `&scope=openid+profile+email` +
      `&redirect_uri=${this.REDIRECT_URI}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;
  }

  getVerifier(): string | undefined {
    const verifier = this.pkceStore.get("current");
    this.pkceStore.delete("current");
    return verifier;
  }

  async exchangeToken(code: string, codeVerifier: string): Promise<any> {
     const response = await fetch(
      `${this.AUTH_DOMAIN}/oauth2/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: this.CLIENT_ID,
          redirect_uri: this.REDIRECT_URI,
          code,
          code_verifier: codeVerifier
        })
      }
    );
    return await response.json();
  }
}

export const authService = new AuthService();
