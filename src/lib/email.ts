/**
 * Tiny, dependency-free email obfuscation.
 *
 * The address never appears in the HTML, the JS bundle or this repository as
 * plain text – only as an XOR-ed, base64url string. It's decoded in the browser
 * on the first real interaction (hover, focus, touch, click), which defeats the
 * regex/HTML scrapers that harvest the vast majority of spam addresses.
 *
 * Generate a new value with:
 *   bun -e "import { encodeEmail } from './src/lib/email.ts'; console.log(encodeEmail('you@example.com'))"
 */

const DEFAULT_KEY = 'solc.dev';

function xor(input: string, key: string): string {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return out;
}

export function encodeEmail(address: string, key = DEFAULT_KEY): string {
  return btoa(xor(address, key)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function decodeEmail(encoded: string, key = DEFAULT_KEY): string {
  const base64 = encoded.replaceAll('-', '+').replaceAll('_', '/');
  return xor(atob(base64), key);
}

/** The site owner's contact address, obfuscated. */
export const CONTACT_EMAIL = 'Fw4aCkokFhkfDEIHSxI';
