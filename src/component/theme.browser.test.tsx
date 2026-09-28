import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import '../app/globals.css';
import ThemeSwitch from './theme';

const root = document.documentElement;

describe('<ThemeSwitch>', () => {
  beforeEach(() => {
    localStorage.clear();
    delete root.dataset.theme;
  });

  afterEach(() => {
    delete root.dataset.theme;
  });

  it('defaults to following the system', async () => {
    await render(<ThemeSwitch />);
    await expect.element(page.getByRole('radio', { name: 'System' })).toBeChecked();
    expect(getComputedStyle(root).colorScheme).toBe('light dark');
  });

  it('applies and persists an explicit theme', async () => {
    await render(<ThemeSwitch />);
    await page.getByTitle('Dark').click();

    await expect.poll(() => root.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(getComputedStyle(root).colorScheme).toBe('dark');
    await expect.element(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  });

  it('forgets the preference when switching back to system', async () => {
    localStorage.setItem('theme', 'light');
    root.dataset.theme = 'light';
    await render(<ThemeSwitch />);
    await expect.element(page.getByRole('radio', { name: 'Light' })).toBeChecked();

    await page.getByTitle('System').click();
    await expect.poll(() => root.dataset.theme).toBeUndefined();
    expect(localStorage.getItem('theme')).toBeNull();
  });
});
