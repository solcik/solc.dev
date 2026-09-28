'use client';

import { useEffect, useRef } from 'react';

import { burst, konami, magnetic, scramble, spotlight, tilt } from '@/effects/dom';

/**
 * Wires the JavaScript half of the special effects to elements marked with
 * `data-fx`. Everything is progressive: without JS the page is complete, and
 * motion effects bow out for `prefers-reduced-motion` and coarse pointers.
 */
export default function Effects() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const one = (name: string) => document.querySelector<HTMLElement>(`[data-fx~="${name}"]`);
    const all = (name: string) => [
      ...document.querySelectorAll<HTMLElement>(`[data-fx~="${name}"]`),
    ];
    const cleanups: Array<() => void> = [konami()];

    const backdrop = one('spotlight');
    if (backdrop) cleanups.push(spotlight(backdrop));
    const wordmark = one('tilt');
    if (wordmark) cleanups.push(tilt(wordmark));
    const trigger = one('burst');
    if (trigger && layer.current) cleanups.push(burst(trigger, layer.current));
    for (const el of all('scramble')) cleanups.push(scramble(el));
    cleanups.push(magnetic(all('magnetic')));

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <div ref={layer} className="fx-layer" aria-hidden="true" />;
}
