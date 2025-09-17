// pages/login.page.ts
import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  private readonly _loginUrl = "https://exe.ua/login";
  private readonly _ordersUrl = "https://exe.ua/my/orders/";
  private _emailOrPhoneInput: Locator;
  private _passwordInput: Locator;
  private _rememberMeCheckbox: Locator;
  private _enterButton: Locator;
  private _errorMessage: Locator;
  private _emailOrPhoneInputError: Locator;
  private _passwordInputError: Locator;

  constructor(page: Page) {
    this.page = page;
    this._emailOrPhoneInput = page.locator('input[name="login"]');
    this._passwordInput = page.locator('input[name="password"]');
    this._rememberMeCheckbox = page.locator(
      'input[type="checkbox"][name="remember"]'
    );
    this._enterButton = page.locator('input[type="submit"][value="Увійти"]');
    this._errorMessage = page.locator(".wa-error-msg");
    this._emailOrPhoneInputError = page.locator(
      ".wa-field-login .wa-error-msg"
    );
    this._passwordInputError = page.locator(".wa-field-password .wa-error-msg");
  }

  async goto() {
    await this.page.goto(this._loginUrl);
  }

   // --- helpers ---
   private async fillEmailOrPhone(value: string) {
    await this._emailOrPhoneInput.fill(value);
  }

  private async fillPassword(value: string) {
    await this._passwordInput.fill(value);
  }

  private async setRememberMe(check = true) {
    if (check) await this._rememberMeCheckbox.check();
    else await this._rememberMeCheckbox.uncheck();
  }

  // Composite method: perform login (fill inputs + checkbox + submit if needed)
  async login(emailOrPhone: string, password: string, rememberMe = false, expectRedirect = true) {
    await this.fillEmailOrPhone(emailOrPhone);
    await this.fillPassword(password);
    await this.setRememberMe(rememberMe);
    if (expectRedirect) {
      await this.submit();
    }
  }

  // Click on the "Login" button and wait for redirect to orders page
  async submit() {
    await Promise.all([
      this.page.waitForURL(this._ordersUrl),
      this._enterButton.click(),
    ]);
  }

  // Assertion: Verify user is successfully logged in
  async assertLoggedIn() {
    await expect(this.page).toHaveURL(this._ordersUrl);
    await expect(this.page.locator("i.fa-user")).toBeVisible();
  }

  // Assertion: Verify login error message is displayed (for wrong credentials)
  async expectLoginError() {
    await this._enterButton.click();
    await expect(this._errorMessage).toBeVisible();
    await expect(this._errorMessage).toHaveText(
      "Неправильне імʼя користувача або пароль."
    );
  }

  // Assertion: Verify error messages for empty email/phone and password
  async expectEmailOrPhoneError() {
    await this._enterButton.click();
    await expect(this._emailOrPhoneInputError).toHaveText(
      "Enter your email address or phone number."
    );
    await expect(this._passwordInputError).toHaveText("Пароль обов`язковий");
  }

  // Assertion: Verify auth_token cookie is present after successful login
  async expectAuthToken() {
    const cookies = await this.page.context().cookies();
    const authToken = cookies.find((c) => c.name === "auth_token");
    await expect(authToken).toBeTruthy();
    await expect(authToken?.value).not.toBe("");
  }
   // Assertion: Verify auth_token is NOT present (negative cases)
   async assertNoAuthToken() {
    const cookies = await this.page.context().cookies();
    const authToken = cookies.find((c) => c.name === "auth_token");
    await expect(authToken).toBeFalsy();
  }
}
