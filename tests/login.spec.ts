import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const credentials = [
  { type: 'email', login: '@gmail.com', password: '*********' },
  { type: 'phone', login: '+38000000000', password: '*********' }
];

test.describe('Login with correct credentials', () => {
  for (const cred of credentials) {
    test(`Successful login with ${cred.type}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(cred.login, cred.password, true, true);
      await loginPage.assertLoggedIn();
    });
  }
});
test(`Login with empty fields`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("", "", false, false);
    await loginPage.expectEmailOrPhoneError();
  });
