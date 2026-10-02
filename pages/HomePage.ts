import type { Page, Locator } from '@playwright/test';

class HomePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  get cartBadge(): Locator {
    return this.page.locator('[data-test="cart-quantity"]');
  }

  get sortDropdown(): Locator {
    return this.page.locator('#sort-dropdown');
  }

  get productLinks(): Locator {
    return this.page.locator('.product-link');
  }

  get productPrices(): Locator {
    return this.page.locator('.product-price');
  }

  get homeLink(): Locator {
    return this.page.locator('a:has(#Layer_1)');
  }

  // Actions
  async addItemToCart(productName: string): Promise<void> {
    await this.page.getByAltText(productName, { exact: true }).click();
    await this.page.locator('[id="btn-add-to-cart"]').click();
  }

  async removeItemFromCart(productName: string): Promise<void> {
    const row = this.page.locator('tr', { has: this.page.locator(`text="${productName}"`) });
    await row.locator('.btn-danger').click();
  }
}

export default HomePage;
