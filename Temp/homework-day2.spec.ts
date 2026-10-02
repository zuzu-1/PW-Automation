import { test, expect } from '@playwright/test';

// Define global constant for base URL
const BASE_URL = 'https://practicesoftwaretesting.com/';

test('Search for pliers', async ({ page }) => {
  // Open homepage
  await page.goto(BASE_URL);

  // Locate search field by accessible role/label
  const searchField = page.getByRole('textbox', { name: 'Search' });
  await searchField.click({ clickCount: 2 });
  await searchField.fill('Pliers');
  await expect(searchField).toHaveValue('Pliers');

  // Click search button
  const searchButton = page.getByRole('button', { name: 'Search' });
  await searchButton.click();

  // Verify product titles count (Moved inside this test where it belongs)
  const productTitles = page.locator('a.card');
  await expect(productTitles).toHaveCount(4);
}); // <-- Added missing closing block

test('Inspect product and add two items to cart', async ({ page }) => {
  // Open homepage using global constant
  await page.goto(BASE_URL);

  // Find Combination Pliers product card
  const combinationPliersCard = page.locator('.card-title').filter({ hasText: 'Combination Pliers' });
  await combinationPliersCard.click();

  // Assert Combination Pliers heading is visible
  const productName = page.locator('//*[@data-test="product-name"]');
  await expect(productName).toBeVisible(); 
  await expect(productName).toContainText('Combination Pliers'); 
  
  const quantityInput = page.locator('[data-test="quantity"]');
  await expect(quantityInput).toHaveValue('1');

  // Increase quantity to 2
  await page.locator('[id="btn-increase-quantity"]').click();
  await expect(quantityInput).toHaveValue('2');

  // Add to cart and assert alert
  await page.locator('[id="btn-add-to-cart"]').click();

  // Wait for toast message to appear
  const alert = page.locator('[role="alert"]');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('Product added to shopping cart');
  
  // Assert cart link shows quantity 2
  const cartLink = page.locator('[data-test="nav-cart"]');
  await expect(cartLink).toBeVisible();
  const cartNumberValue =page.locator('[data-test="cart-quantity"]')
  await expect(cartNumberValue).toContainText('2');
});

test('Sort products by name', async ({ page }) => {
  // Open homepage using global constant
  await page.goto(BASE_URL);

  // Select 'Name (A - Z)' from Sort dropdown
  const sortDropdown = page.getByLabel('Sort');
  await sortDropdown.selectOption('Name (A - Z)');

  // Locate product titles with class name "card-title"
  const productTitles = page.locator('.card-title');
  await expect(productTitles).toHaveCount(9);

  // Assert first title contains "Adjustable Wrench"
  await expect(productTitles.first()).toHaveText('Adjustable Wrench');

  // Assert first title has CSS class "card-title"
  await expect(productTitles.first()).toHaveClass('card-title');
});

test('Filter catalog to hammers', async ({ page }) => {
  // Open homepage
  await page.goto(BASE_URL);

  // Locate and check Hammer checkbox
  const hammerCheckbox = page.getByLabel('Hammer');
  await hammerCheckbox.check();
  await expect(hammerCheckbox).toBeChecked();

  // Count product titles with class name "card"
  const productTitles = page.locator('.card');
  await expect(productTitles).toHaveCount(7);

  // Uncheck Hammer checkbox
  await hammerCheckbox.uncheck();
  await expect(hammerCheckbox).not.toBeChecked();
});
