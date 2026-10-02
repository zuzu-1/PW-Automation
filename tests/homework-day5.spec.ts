import { test, expect } from '../fixtures.js';
import * as fs from 'fs';
import * as path from 'path';
import LoginPage from '../pages/LoginPage.js';

// TASK 1: Create a logged in fixture
test('confirms the account page is open', async ({ loggedInPage }) => {
  await expect(loggedInPage).toHaveURL(/.*\/account/);
});

// TASK 2: Use all Playwright hooks
test.describe('catalog hooks', () => {
  test.beforeAll(async () => {
    console.log(`Suite started at: ${new Date().toISOString()}`);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      const screenshot = await page.screenshot();
      await testInfo.attach('failure-screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });

  test.afterAll(async () => {
    console.log('Suite finished.');
  });

  test('confirms the catalog page loaded', async ({ page }) => {
    await expect(page.locator('[data-test="sort"]')).toBeVisible();
  });
});

// TASK 3: Drive login tests from CSV
const csvPath = path.join(process.cwd(), 'test-data', 'login-cases.csv');
const csvData = fs.readFileSync(csvPath, 'utf-8');
const lines = csvData.trim().split('\n');
const headers = lines[0].split(',');
const records = lines.slice(1).map(line => {
  const values = line.split(',');
  return headers.reduce((obj, header, index) => {
    obj[header.trim()] = values[index].trim();
    return obj;
  }, {} as Record<string, string>);
});

test.describe('Drive login tests from CSV', () => {
  for (const record of records) {
    test(`Login test: ${record.name}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(record.email, record.password);

      if (record.expectedResult === 'success') {
        await expect(page).toHaveURL(/.*\/account/);
      } else {
        await expect(page.getByText('Invalid email or password')).toBeVisible();
      }
    });
  }
});
