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

  test.skip("happy path registration", async () => {
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


  test("Surname - form accepts valid value and proceeds to validate next required input", async () => {
    await registrationPage.fillForm({
      surname: "Parker",
    });
    await registrationPage.clickRegisterButton();
    await registrationPage.assertFormErrorMessage(
      "Введіть ім'я та по батькові" //"Enter name and middle name"
    );
  });

  test("Name and Middle name input - form accepts valid value and proceeds to validate next required input", async () => {
    await registrationPage.fillForm({
      surname: "Parker",
      name_middleName: "Peter Junior",
    });
    await registrationPage.assertFormErrorMessage("Введіть телефон"); //"Enter phone number"
  });

  test("Phone number - form accepts valid value and proceeds to validate next required input", async () => {
    await registrationPage.fillForm({
      surname: "Parker",
      name_middleName: "Peter Junior",
      phone: "+380723424455",
    });
    await registrationPage.assertFormErrorMessage("Введіть e-mail"); //"Enter e-mail"
  });

  test("E-mail - form accepts valid value and proceeds to validate next required input", async () => {
    await registrationPage.fillForm({
      surname: "Parker",
      name_middleName: "Peter Junior",
      phone: "+380723424455",
      mail: "sdasdwd@gmail.com",
    });
    await registrationPage.assertFormErrorMessage("Введіть пароль"); //"Enter password"
  });

  test("Password - form accepts valid value and proceeds to validate next required input", async () => {
    await registrationPage.fillForm({
      surname: "Parker",
      name_middleName: "Peter Junior",
      phone: "+380723424455",
      mail: "sdasdwd@gmail.com",
      password: "2e22DD@#4sw",
    });
    await registrationPage.assertFormErrorMessage("Введіть пароль"); //"Enter password"
  });

});
