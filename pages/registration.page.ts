import { Page, Locator, expect } from "@playwright/test";


type RegistrationFormData = {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    phone?: string | number;
    password?: string;
    confirmPassword?: string;
    captcha?: string | number;
  };

export class Registration {

    readonly page: Page;
    private nameField: Locator;
    private middleNameField: Locator;
    private lastNameField: Locator;
    private emailField: Locator;
    private phoneField: Locator;
    private passwordField: Locator;
    private confirmPasswordField: Locator;
    private captchaField: Locator;
    private registerButton: Locator;
    private alreadyRegisteredButton: Locator;
    private fields: Record<keyof RegistrationFormData, Locator>;



  constructor(page: Page) {
    this.page = page;
    this.nameField = page.locator('[name="data[firstname]"]');
    this.middleNameField = page.locator('[name="data[middlename]"]');
    this.lastNameField = page.locator('[name="data[lastname]"]');
    this.emailField = page.locator('[name="data[email]"]');
    this.phoneField = page.locator('[name="data[phone]"]');
    this.passwordField = page.locator('[name="data[password]"]');
    this.confirmPasswordField = page.locator('[name="data[password_confirm]"]');
    this.captchaField = page.locator('[name="captcha"]');
    this.registerButton = page.locator('input[type="submit"][value="Зареєструватися"]');
    this.alreadyRegisteredButton = page.locator('a[href="/login/"]');

    // Map of fields for the universal fillForm method
    this.fields = {
        firstName: this.nameField,
        middleName: this.middleNameField,
        lastName: this.lastNameField,
        email: this.emailField,
        phone: this.phoneField,
        password: this.passwordField,
        confirmPassword: this.confirmPasswordField,
        captcha: this.captchaField,
      };
}



// Universal method for filling the form
async fillForm(data: RegistrationFormData) {
    for (const [key, locator] of Object.entries(this.fields)) {
      const value = (data as any)[key];
      if (value !== undefined) {
        await locator.fill(String(value)); // convert everything to a string
      }
    }
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async clickAlreadyRegistered() {
    await this.alreadyRegisteredButton.click();
  }



}
