import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import HomePage from '../pages/HomePage.js';

const TEST_EMAIL = 'customer@practicesoftwaretesting.com';
const TEST_PASSWORD = 'welcome01';
test.describe('Cart functionality', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(TEST_EMAIL, TEST_PASSWORD)
  });
  
  test('Adding item to cart', async () => {

    await expect(homePage.cartBadge).not.toBeVisible();

    await homePage.homeLink.click();
 
    await homePage.addItemToCart('Combination Pliers');

    await expect(homePage.cartBadge).toContainText('1');

    await homePage.homeLink.click();

    await homePage.addItemToCart('Bolt Cutters');

    await expect(homePage.cartBadge).toContainText('2');
  });

  test('Removing item from cart', async () => {

    await homePage.homeLink.click();

    await homePage.addItemToCart('Combination Pliers');
    await expect(homePage.cartBadge).toContainText('1');

    await homePage.homeLink.click();
    await homePage.addItemToCart('Pliers');

    await expect(homePage.cartBadge).toHaveText('2');

    await homePage.cartBadge.click();

    await homePage.removeItemFromCart('Pliers');
    
    await expect(homePage.cartBadge).toHaveText('1');
  });
});
