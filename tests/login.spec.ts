//login.spec.ts
import { test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

const credentials = [
  { type: "email", login: "sdfsdfsdf@gmail.com", password: "sdsadSDdsf#3" },
  { type: "phone", login: "+380000000000", password: "sdsadSDdsf#3" },
];

test.describe("Login tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.afterAll(async ({ page }) => {
     page.close();
  });

  //positive test
  test.describe("#1: Login with correct credentials (email and phone)", () => {
    for (const cred of credentials) {
      test(`Successful login with ${cred.type}`, async () => {
        await loginPage.login(cred.login, cred.password, true, true);
        await loginPage.assertLoggedIn();
        await loginPage.expectAuthToken();
      });
    }
  });

  //negative tests
  test("#2: Login with empty fields", async () => {
    await loginPage.login("", "", false, false);
    await loginPage.expectEmailOrPhoneError();
  });

  test("#3: Login with registered email and wrong (valid) password ", async () => {
    await loginPage.login(
      "faloout@gmail.com","wrongPassword123@",false,false);
    await loginPage.expectLoginError();
  });

  test("#4: Login with  Invalid credentials (non-existent account) ", async () => {
    await loginPage.login("notfound@example.com", "AnyPass12!", false, false);
    await loginPage.expectLoginError();
  });

  test("#5: Login with  incorrect email format ", async () => {
    await loginPage.login("invalid@com", "sdsadSD23@#", false, false);
    await loginPage.expectLoginError();
  });
});
