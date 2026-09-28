import { describe, expect, it } from 'vitest';

import {
  KONAMI,
  burstParticles,
  clamp,
  createSequenceMatcher,
  lerp,
  magneticOffset,
  scrambleText,
  tiltAngles,
} from './math';

/** Deterministic PRNG (mulberry32) so random-driven effects are testable. */
function seeded(seed = 1) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('clamp / lerp', () => {
  it('clamps', () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it('interpolates', () => {
    expect(lerp(0, 10, 0.25)).toBe(2.5);
  });
});

describe('tiltAngles', () => {
  const rect = { left: 0, top: 0, width: 200, height: 100 };

  it('is flat at the centre', () => {
    const { rx, ry } = tiltAngles(100, 50, rect, 10);
    expect(rx).toBeCloseTo(0);
    expect(ry).toBeCloseTo(0);
  });

  it('reaches ±max at the edges and clamps beyond', () => {
    expect(tiltAngles(200, 50, rect, 10).ry).toBeCloseTo(10);
    expect(tiltAngles(0, 0, rect, 10)).toEqual({ rx: 10, ry: -10 });
    expect(tiltAngles(9999, 9999, rect, 10)).toEqual({ rx: -10, ry: 10 });
  });
});

describe('magneticOffset', () => {
  it('is zero outside the radius and at the exact centre', () => {
    expect(magneticOffset(200, 0, 100)).toEqual({ x: 0, y: 0 });
    expect(magneticOffset(0, 0, 100)).toEqual({ x: 0, y: 0 });
  });

  it('pulls towards the pointer, weaker further away', () => {
    const near = magneticOffset(20, 0, 100, 0.5);
    const far = magneticOffset(80, 0, 100, 0.5);
    expect(near.x).toBeGreaterThan(0);
    expect(near.y).toBe(0);
    expect(near.x / 20).toBeGreaterThan(far.x / 80);
  });
});

describe('scrambleText', () => {
  it('keeps length and whitespace, settles left to right', () => {
    const rng = seeded(42);
    const frame = scrambleText('David Šolc', 0.5, rng);
    expect([...frame]).toHaveLength(10);
    expect(frame[5]).toBe(' ');
    expect(frame.startsWith('David')).toBe(true);
  });

  it('is fully resolved at progress 1', () => {
    expect(scrambleText('David Šolc', 1, seeded())).toBe('David Šolc');
  });
});

describe('burstParticles', () => {
  it('creates the requested number of particles within bounds', () => {
    const particles = burstParticles(24, seeded(7), 285);
    expect(particles).toHaveLength(24);
    for (const p of particles) {
      const distance = Math.hypot(p.dx, p.dy);
      expect(distance).toBeGreaterThanOrEqual(80);
      expect(distance).toBeLessThanOrEqual(200);
      expect(p.hue).toBeGreaterThanOrEqual(0);
      expect(p.hue).toBeLessThan(360);
    }
  });
});

describe('createSequenceMatcher', () => {
  it('fires once the full Konami code is typed, case-insensitive', () => {
    const match = createSequenceMatcher();
    const keys = [...KONAMI.slice(0, -2), 'B', 'A'];
    const results = keys.map(match);
    expect(results.at(-1)).toBe(true);
    expect(results.slice(0, -1).every((r) => !r)).toBe(true);
  });

  it('recovers from a wrong key that restarts the sequence', () => {
    const match = createSequenceMatcher(['x', 'y']);
    expect(match('x')).toBe(false);
    expect(match('x')).toBe(false);
    expect(match('y')).toBe(true);
  });
});
