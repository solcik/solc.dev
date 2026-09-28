import { describe, expect, it } from 'vitest';

import { CONTACT_EMAIL, decodeEmail, encodeEmail } from './email';

describe('email obfuscation', () => {
  it('round-trips an address', () => {
    const address = 'someone+tag@example.co.uk';
    expect(decodeEmail(encodeEmail(address))).toBe(address);
  });

  it('produces url-safe output without the address or an @ sign', () => {
    const encoded = encodeEmail('someone@example.com');
    expect(encoded).toMatch(/^[\w-]+$/);
    expect(encoded).not.toContain('@');
    expect(encoded).not.toContain('example');
  });

  it('depends on the key', () => {
    expect(encodeEmail('a@b.c', 'one')).not.toBe(encodeEmail('a@b.c', 'two'));
  });

  it('ships a valid contact address on the solc.dev domain', () => {
    expect(decodeEmail(CONTACT_EMAIL)).toMatch(/^[^\s@]+@solc\.dev$/);
  });
});
