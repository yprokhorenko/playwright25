import { Registration } from "../pages/registration.page";
import { test } from "@playwright/test";

test.describe("Registrations Tests", () => {
  let registrationPage: Registration;

  const generateUniqueData = () => {
    const timestamp = Date.now();
    return {
      email: `test_${timestamp}@gmail.com`,
      phone: `+38072${timestamp.toString().slice(-7)}`
    };
  };

  const EXISTING_PHONE = "+380913423423";
  const EXISTING_EMAIL = "sddare342323d@gmail.com";

  test.beforeEach(async ({ page }) => {
    await page.goto("https://olla.ua");
    registrationPage = new Registration(page);
    await registrationPage.openRegistrationTab();
  });

  test.skip("happy path registration", async () => {
    // Skipped to avoid creating new accounts on every test run
    // Enable only when testing registration functionality
    const { email, phone } = generateUniqueData();

    await registrationPage.fillForm({
      surname: "Parker",
      name_middleName: "Peter Junior",
      mail: email,
      phone: phone,
      password: "sds23@W11!!",
    });
    await registrationPage.assertUserIsRegistered();
  });


  test("Surname - form accepts valid value and proceeds to validate next required input", async () => {
    await registrationPage.fillForm({
      surname: "Parker",
    });
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

 //negative cases

    

    test("Submit Registration Form with Empty Fields", async () => {
      await registrationPage.clickRegisterButton();
      await registrationPage.assertFormErrorMessage("Введіть ім'я та по батькові");
    });
    
    test("Registration with an already registered phone number", async ()=> {
      const { email } = generateUniqueData();

      await registrationPage.fillForm({
        surname: "Parker",
        name_middleName: "Peter Junior",
        mail: email,
        phone: EXISTING_PHONE,
        password: "sds23@W11!!"
      })
      await registrationPage.assertFormErrorMessage("Телефон вже зайнятий!") //Phone number is already taken!
    })

    test("Registration with an already registered email", async ()=>{
      const { phone } = generateUniqueData();

      await registrationPage.fillForm({
        surname: "Parker",
        name_middleName: "Peter Junior",
        mail: EXISTING_EMAIL,
        phone: phone,
        password: "sds23@W11!!"
      })
      await registrationPage.assertFormErrorMessage("E-mail вже зайнятий!") //Email is already taken!
    })


  // Skipped - no field validation
    test.skip("Surname input should not accept numbers", async () => {
      await registrationPage.fillForm({
        surname: "324234",
      });
      await registrationPage.assertFormErrorMessage(
        "Прізвище має містити лише літери"
      );
    });
    test.skip("Surname input should not accept special characters", async () => {
      await registrationPage.fillForm({
        surname: "%//%.",
      });
      await registrationPage.assertFormErrorMessage(
        "Прізвище має містити лише літери"
      );
    }); 
});
