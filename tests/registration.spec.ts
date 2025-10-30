import { test } from "@playwright/test";
import { Registration } from "../pages/registration.page";
import { Page, Locator, expect } from "@playwright/test";

test.describe("Registrations Tests", () => {
  let registrationPage: Registration;

  test.beforeEach(async ({ page }) => {
    await page.goto("https://olla.ua");
    registrationPage = new Registration(page);
    await registrationPage.openRegistrationTab();
  });

  test.skip("happy path registration", async ({ page }) => {
    // Skipped to avoid creating new accounts on every test run
    // Enable only when testing registration functionality
    const uniqueEmail = `test_${Date.now()}@gmail.com`;
    const uniquePhoneNumber = `+38072${Date.now().toString().slice(-7)}`;

    await registrationPage.fillForm({
      surname: "Parker",
      name_middleName: "Peter Junior",
      mail: uniqueEmail,
      phone: uniquePhoneNumber,
      password: "sds23@W11!!",
    });
    await registrationPage.assertUserIsRegistered();
  });
});
