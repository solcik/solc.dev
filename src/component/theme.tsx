'use client';

import { useSyncExternalStore, type ChangeEvent } from 'react';

import { MoonIcon, SunIcon, SystemIcon } from './icons';

export type Theme = 'light' | 'auto' | 'dark';

const STORAGE_KEY = 'theme';

const options = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'auto', label: 'System', Icon: SystemIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
] as const;

/**
 * Runs inline in <head> before first paint so the stored preference is
 * applied without a flash. Kept tiny and dependency-free on purpose.
 */
export const themeBootstrap = `try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

function subscribe(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (document.documentElement.dataset.theme as Theme) ?? 'auto';
const getServerSnapshot = (): Theme => 'auto';

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'auto') delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    if (theme === 'auto') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) – theme still applies.
  }
}

function onChange(event: ChangeEvent<HTMLInputElement>) {
  const next = event.currentTarget.value as Theme;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.startViewTransition || reduceMotion) {
    applyTheme(next);
    return;
  }

  // Circular reveal grows from the chosen control to the farthest viewport corner.
  const rect = event.currentTarget.closest('label')!.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const style = document.documentElement.style;
  style.setProperty('--vt-x', `${x}px`);
  style.setProperty('--vt-y', `${y}px`);
  style.setProperty('--vt-r', `${r}px`);

  document.startViewTransition(() => applyTheme(next));
}

export default function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <fieldset className="theme">
      <legend className="sr-only">Color theme</legend>
      {options.map(({ value, label, Icon }) => (
        <label key={value} title={label}>
          <input
            type="radio"
            name="theme"
            value={value}
            checked={theme === value}
            onChange={onChange}
          />
          <Icon width="18" height="18" />
          <span className="sr-only">{label}</span>
        </label>
      ))}
      <span className="theme__thumb" aria-hidden="true" />
    </fieldset>
  );
}
