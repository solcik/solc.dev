import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';

import { burst, konami, scramble } from './dom';
import { KONAMI } from './math';

const cleanups: Array<() => void> = [];
afterEach(() => {
  cleanups.splice(0).forEach((fn) => fn());
  document.body.replaceChildren();
  delete document.documentElement.dataset.party;
});

describe('konami()', () => {
  it('toggles party mode on the root element', async () => {
    cleanups.push(konami());
    const sequence = KONAMI.map((key) => (key.length === 1 ? key : `{${key}}`)).join('');

    await userEvent.keyboard(sequence);
    expect('party' in document.documentElement.dataset).toBe(true);

    await userEvent.keyboard(sequence);
    expect('party' in document.documentElement.dataset).toBe(false);
  });
});

describe('scramble()', () => {
  it('animates and settles on the original text', async () => {
    const el = Object.assign(document.createElement('span'), { textContent: 'David Šolc' });
    document.body.append(el);
    cleanups.push(scramble(el, 150));

    await expect.poll(() => el.textContent, { timeout: 2000 }).toBe('David Šolc');
  });
});

describe('burst()', () => {
  it('spawns particles on pointerdown and cleans them up afterwards', async () => {
    const trigger = document.createElement('button');
    const layer = document.createElement('div');
    document.body.append(trigger, layer);
    cleanups.push(burst(trigger, layer));

    trigger.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 10 }));
    expect(layer.querySelectorAll('.fx-particle').length).toBeGreaterThan(10);

    await expect.poll(() => layer.childElementCount, { timeout: 3000 }).toBe(0);
  });
});
