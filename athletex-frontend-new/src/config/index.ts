class EnvConfig {
  private backendApiUrl: string;

  constructor() {
    this.backendApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  }

  getApiUrl(): string {
    if (!this.backendApiUrl) {
      throw new Error("API URL is not defined in environment variables");
    }
    return `${this.backendApiUrl}/`;
  }
}

const config = new EnvConfig();
export default config;
