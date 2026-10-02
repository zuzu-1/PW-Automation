import type { Page, Locator } from '@playwright/test';

class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  get email(): Locator {
    return this.page.locator('#email');
  }

  get password(): Locator {
    return this.page.locator('#password');
  }

  get loginButton(): Locator {
    return this.page.locator('[data-test="login-submit"]');
  }

  // Actions
  async goto(): Promise<void> {
    await this.page.goto(
      'https://practicesoftwaretesting.com/auth/login/'
    );
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();

    // Wait until login/navigation has completed
    await this.page.waitForLoadState('networkidle');
  }
}

export default LoginPage;