import { expect, test } from '@playwright/test';

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;

test.describe('home page', () => {
  test('renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page).toHaveTitle('solc.dev');
    await expect(page.getByRole('heading', { level: 1, name: 'solc.dev' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Elsewhere' }).getByRole('link')).toHaveCount(
      6
    );
    expect(errors).toEqual([]);
  });

  test('never ships the email address in the HTML', async ({ page, request }) => {
    const html = await (await request.get('/')).text();
    expect(html).not.toMatch(EMAIL_PATTERN);
    expect(html).not.toContain('mailto:');

    await page.goto('/');
    const link = page.getByRole('link', { name: 'Email' });
    await link.focus();
    await expect(link).toHaveAttribute('href', /^mailto:[^@\s]+@solc\.dev$/);
  });

  test('external links are safe and marked rel=me', async ({ page }) => {
    await page.goto('/');
    for (const link of await page.locator('a[target=_blank]').all()) {
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /\bme\b/);
    }
  });

  test('theme choice applies instantly and survives a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const scheme = () =>
      page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);

    await page.getByTitle('Dark').click();
    await expect.poll(scheme).toBe('dark');

    await page.reload();
    // Applied by the inline head script before hydration – no flash.
    expect(await scheme()).toBe('dark');
    await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  });

  test('Konami code toggles party mode', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard easter egg');
    await page.goto('/');
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    for (const key of [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ]) {
      await page.keyboard.press(key);
    }
    await expect(page.locator('html')).toHaveAttribute('data-party', '');
  });

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
