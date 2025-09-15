// pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
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
    this._rememberMeCheckbox = page.locator('input[type="checkbox"][name="remember"]');
    this._enterButton = page.locator('input[type="submit"][value="Увійти"]');
    this._errorMessage = page.locator('.wa-error-msg'); 
    this._emailOrPhoneInputError = page.locator('.wa-field-login .wa-error-msg');
    this._passwordInputError = page.locator('.wa-field-password .wa-error-msg');
  }

  async goto() {
    await this.page.goto('https://exe.ua/login');
  }

  async fillEmailOrPhone(value: string) {
    await this._emailOrPhoneInput.fill(value);
  }

  async fillPassword(value: string) {
    await this._passwordInput.fill(value);
  }

  async setRememberMe(check = true) {
    if (check) await this._rememberMeCheckbox.check();
    else await this._rememberMeCheckbox.uncheck();
  }


  // --- композиційний метод для зручності ---
  async login(emailOrPhone: string, password: string, rememberMe = false, expectRedirect = true) {
    await this.fillEmailOrPhone(emailOrPhone);
    await this.fillPassword(password);
    await this.setRememberMe(rememberMe);
    if (expectRedirect) {
        await this.submit();
    }
    
  }

  
  async submit() {
    await Promise.all([
        this.page.waitForURL('https://exe.ua/my/orders/'),
        this._enterButton.click()
    ]);
  }
  
  // Перевірка успішного входу 
  async assertLoggedIn() {
    await expect(this.page).toHaveURL('https://exe.ua/my/orders/');
    await expect(this.page.locator('i.fa-user')).toBeVisible();
  }

  // Перевірка помилки входу (on submit click)
  async expectLoginError() {
    await expect(this._errorMessage).toBeVisible();
    await expect(this._errorMessage).toHaveText("Неправильне імʼя користувача або пароль.");
  }

  async expectEmailOrPhoneError() {
    this._enterButton.click()
    await expect(this._emailOrPhoneInputError).toHaveText("Enter your email address or phone number.");
    await expect(this._passwordInputError).toHaveText("Пароль обов`язковий");
  }
  


}
