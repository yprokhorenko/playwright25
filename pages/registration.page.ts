import { Page, Locator, expect } from "@playwright/test";

type RegistrationFormData = {
  surname?: string;
  name_middleName?: string;
  mail?: string;
  phone?: string;
  password?: string;
};

export class Registration {
  readonly page: Page;

  private surname: Locator;
  private name_middleName: Locator;
  private mail: Locator;
  private phone: Locator;
  private password: Locator;
  private registerButton: Locator;
  private authModal: Locator;
  private registrationTab: Locator;
  private formErrorMessage: Locator;
  private fields: Record<keyof RegistrationFormData, Locator>;

  constructor(page: Page) {
    this.page = page;

    this.surname = page.locator("#reg_tab input[name=surname]");
    this.name_middleName = page.locator("#reg_tab input[name=name]");
    this.mail = page.locator("#reg_tab input[name=mail]");
    this.phone = page.locator("#reg_tab input[name=phone]");
    this.password = page.locator("#reg_tab input[name=password]");
    this.registerButton = page.locator("#reg_tab #go_reg");
    this.authModal = page.locator("#head #top_login");
    this.registrationTab = page.locator(".lrm-switch-to--register");
    this.formErrorMessage = page.locator("#reg_tab #vs_error_reg");

    // Map of fields for the universal fillForm method
    this.fields = {
      surname: this.surname,
      name_middleName: this.name_middleName,
      mail: this.mail,
      phone: this.phone,
      password: this.password,
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
    await this.registerButton.click();
  }

  async openRegistrationTab() {
    await this.authModal.click();
    await this.registrationTab.click();
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  //assertions

  async assertUserIsRegistered() {
    await this.page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(this.page).toHaveURL(/\/account/);
  }

  async assertFormErrorMessage(expectedText: string) {
    await expect(this.formErrorMessage).toHaveText(expectedText);
  }
}
