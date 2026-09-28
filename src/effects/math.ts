/** Pure helpers behind the effects – kept DOM-free so they're unit-testable. */

export type Rng = () => number;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/**
 * 3D tilt angles (degrees) for a pointer at (x, y) over a rect.
 * Centre → 0/0, edges → ±max. Pointer above the centre tilts the top towards the viewer.
 */
export function tiltAngles(
  x: number,
  y: number,
  rect: { left: number; top: number; width: number; height: number },
  max = 12
): { rx: number; ry: number } {
  const nx = clamp(((x - rect.left) / rect.width) * 2 - 1, -1, 1);
  const ny = clamp(((y - rect.top) / rect.height) * 2 - 1, -1, 1);
  return { rx: -ny * max, ry: nx * max };
}

/**
 * Magnetic pull: offset (px) an element at distance (dx, dy) from the pointer
 * should move towards it. Zero outside `radius`, strongest near the centre.
 */
export function magneticOffset(
  dx: number,
  dy: number,
  radius = 120,
  strength = 0.35
): { x: number; y: number } {
  const distance = Math.hypot(dx, dy);
  if (distance >= radius || distance === 0) return { x: 0, y: 0 };
  const falloff = 1 - distance / radius;
  return { x: dx * strength * falloff, y: dy * strength * falloff };
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\ŠŽČŘ';

/**
 * One frame of a "decode" animation: characters left of the progress front
 * are final, the rest are random glyphs. Whitespace is always preserved.
 */
export function scrambleText(final: string, progress: number, rng: Rng = Math.random): string {
  const chars = [...final];
  const settled = Math.floor(clamp(progress, 0, 1) * chars.length);
  return chars
    .map((char, i) =>
      i < settled || /\s/.test(char) ? char : GLYPHS[Math.floor(rng() * GLYPHS.length)]
    )
    .join('');
}

export type Particle = { dx: number; dy: number; hue: number; size: number; rotate: number };

/** Evenly spread, slightly jittered burst vectors. */
export function burstParticles(count: number, rng: Rng = Math.random, baseHue = 285): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (rng() - 0.5) * 0.6;
    const distance = 80 + rng() * 120;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      hue: (baseHue + rng() * 160) % 360,
      size: 6 + rng() * 10,
      rotate: (rng() - 0.5) * 720,
    };
  });
}

export const KONAMI = [
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
] as const;

/** Feed it keys; returns true exactly when the full sequence has just been typed. */
export function createSequenceMatcher(sequence: readonly string[] = KONAMI) {
  let index = 0;
  return (key: string): boolean => {
    const k = key.length === 1 ? key.toLowerCase() : key;
    if (k === sequence[index]) {
      index++;
      if (index === sequence.length) {
        index = 0;
        return true;
      }
      return false;
    }
    index = k === sequence[0] ? 1 : 0;
    return false;
  };
}
