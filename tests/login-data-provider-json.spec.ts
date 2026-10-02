import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import * as fs from 'fs';
import * as path from 'path';

const loginData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'test-data', 'login.json'), 'utf-8'));

test.describe('Drive login tests from JSON', () => {
  for (const record of loginData) {
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
