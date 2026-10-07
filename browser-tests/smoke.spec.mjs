import {test,expect} from '@playwright/test';

test('Vehicle selection preserves model and year in quote, reset and Escape work',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await expect(page).toHaveTitle(/Elektrikli Yan Basamak/);
 await page.screenshot({path:testInfo.outputPath('homepage.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.selectOption('#finder-brand','Chery');
 await page.selectOption('#finder-model','Tiggo 8 Pro Max');
 await page.selectOption('#finder-year','2025');
 await page.locator('#finder button[type=submit]').click();
 await expect(page.locator('.finder-result')).toContainText('2025 Chery Tiggo 8 Pro Max');
 await page.locator('.finder-result button').click();
 await expect(page.locator('#quote-dialog')).toBeVisible();
 await page.fill('#quote-city','Antalya');
 await page.locator('#quote-form button[type=submit]').click();
 await expect(page.locator('#quote-message')).toHaveValue(/2025 Chery Tiggo 8 Pro Max.*Antalya/);
 await expect(page.locator('#quote-output')).toContainText('Mesajınız gönderilmedi.');
 await page.keyboard.press('Escape');
 await expect(page.locator('#quote-dialog')).not.toBeVisible();
 await page.selectOption('#finder-brand','Ford');
 await expect(page.locator('.finder-result')).not.toBeVisible();
 await expect(page.locator('#finder-model')).toHaveValue('');
 await expect(page.locator('#finder-model option')).not.toContainText(['Tiggo 8 Pro Max']);
 expect(errors).toEqual([]);
});

test('An unlisted vehicle can prepare a message without a false compatibility claim',async({page})=>{
 await page.goto('/iletisim/');
 await page.selectOption('#contact-finder-brand','other');
 await page.locator('#contact-finder input[name=otherVehicle]').fill('Toyota Hilux çift kabin');
 await page.selectOption('#contact-finder-year','2019');
 await page.locator('#contact-finder button[type=submit]').click();
 await page.locator('.finder-result button').click();
 await page.locator('#quote-form button[type=submit]').click();
 await expect(page.locator('#quote-message')).toHaveValue(/2019 Toyota Hilux çift kabin/);
 await expect(page.locator('#quote-output')).toContainText('Mesajınız gönderilmedi.');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('FAQ and navigation are accessible on the active viewport',async({page},testInfo)=>{
 await page.goto('/');
 await page.locator('details').first().locator('summary').click();
 await expect(page.locator('details').first()).toHaveAttribute('open','');
 if(testInfo.project.name==='mobile') {
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','true');
 }
 await page.locator('#main-nav a[href="/rehber/"]').click();
 await expect(page.locator('h1')).toHaveText('Elektrikli Yan Basamak Rehberi');
 await expect(page.locator('.guide-card')).toHaveCount(5);
});
