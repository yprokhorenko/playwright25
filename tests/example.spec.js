// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async({page})=> {
  await page.goto('https:/exe.ua/login/');
})

test('site shows errors then trying to login without user data', async ({ page }) => {

  await page.locator('input[name="login"]').fill("balala asl a");
  await page.locator('input[value="Увійти"]').click();
  await expect(page.locator('em.wa-error-msg')).toHaveText("Пароль обов`язковий");

});