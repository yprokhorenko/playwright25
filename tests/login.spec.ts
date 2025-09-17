//login.spec.ts
import { test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

const credentials = [
  { type: "email", login: "**************", password: "**************" },
  { type: "phone", login: "**************", password: "**************" },
];

test.describe("Login tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.afterAll(async ({ page }) => { await page.close(); });

  // Positive tests
  test.describe("Positive Login tests", () => {
    for (const cred of credentials) {
      test(`Successful login with ${cred.type}`, async () => {
        await loginPage.login(cred.login, cred.password, true, true);
        await loginPage.assertLoggedIn();
        await loginPage.expectAuthToken();
      });
    }
  });

  // Negative tests
  test.describe("Negative Login tests", () => {
    test("Login with empty fields", async () => {
      await loginPage.login("", "", false, false);
      await loginPage.expectEmailOrPhoneError();
      await loginPage.assertNoAuthToken();
    });

    test("Login with registered email and wrong (valid) password", async () => {
      await loginPage.login("faloout@gmail.com", "wrongPassword123@", false, false);
      await loginPage.expectLoginError();
      await loginPage.assertNoAuthToken();
    });

    test("Login with invalid credentials (non-existent account)", async () => {
      await loginPage.login("notfound@example.com", "AnyPass12!", false, false);
      await loginPage.expectLoginError();
      await loginPage.assertNoAuthToken();
    });

    test("Login with incorrect email format", async () => {
      await loginPage.login("invalid@com", "sdsadSD23@#", false, false);
      await loginPage.expectLoginError();
      await loginPage.assertNoAuthToken();
    });
  });
});