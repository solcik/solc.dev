import type { ComponentType, SVGProps } from 'react';

import Effects from '@/component/effects';
import ProtectedEmailLink from '@/component/email';
import ThemeSwitch from '@/component/theme';
import { CONTACT_EMAIL } from '@/lib/email';
import {
  FacebookIcon,
  GitHubIcon,
  KeybaseIcon,
  LinkedInIcon,
  MailIcon,
  XIcon,
} from '@/component/icons';

type Link = {
  id: string;
  label: string;
  /** Omit for the protected email link. */
  href?: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const links: Link[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/solcik', Icon: GitHubIcon },
  { id: 'x', label: 'X', href: 'https://x.com/fastsolcik', Icon: XIcon },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/davidsolc',
    Icon: LinkedInIcon,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/solc.david',
    Icon: FacebookIcon,
  },
  { id: 'keybase', label: 'Keybase', href: 'https://keybase.io/solcik', Icon: KeybaseIcon },
  { id: 'mail', label: 'Email', Icon: MailIcon },
];

/**
 * Each entry is lit up purely by an `@supports` block in globals.css,
 * so the list doubles as a live report card for the visitor's browser.
 */
const features = [
  { id: 'layer', name: 'Cascade layers' },
  { id: 'has', name: ':has()' },
  { id: 'scope', name: '@scope' },
  { id: 'container', name: 'Container queries' },
  { id: 'lightdark', name: 'light-dark()' },
  { id: 'rcs', name: 'Relative colors' },
  { id: 'anchor', name: 'Anchor positioning' },
  { id: 'vt', name: 'View transitions' },
  { id: 'starting', name: '@starting-style' },
  { id: 'linear', name: 'linear() easing' },
  { id: 'textbox', name: 'text-box trim' },
  { id: 'interpolate', name: 'interpolate-size' },
  { id: 'sibling', name: 'sibling-index()' },
  { id: 'squircle', name: 'corner-shape' },
];

const word = 'solc';

export default function HomePage() {
  return (
    <>
      <div className="backdrop" aria-hidden="true" data-fx="spotlight">
        <div className="backdrop__aurora" />
        <div className="backdrop__grid" />
        <div className="backdrop__grid backdrop__grid--lit" />
        <div className="backdrop__glow" />
      </div>
      <Effects />

      <header className="topbar">
        <ThemeSwitch />
      </header>

      <main className="hero">
        <h1 className="wordmark" aria-label="solc.dev" data-fx="tilt burst">
          <span className="wordmark__letters" aria-hidden="true">
            {[...word].map((char, i) => (
              // oxlint-disable-next-line react/no-array-index-key -- static text, never reorders
              <span key={i} className="wordmark__char">
                {char}
              </span>
            ))}
          </span>
          <span className="wordmark__tld" aria-hidden="true">
            <span className="wordmark__ink">.dev</span>
          </span>
        </h1>

        <p className="byline">
          <span className="sr-only">David Šolc</span>
          <span aria-hidden="true" data-fx="scramble">
            David Šolc
          </span>
        </p>

        <nav aria-label="Elsewhere">
          <ul className="dock">
            {links.map(({ id, label, href, Icon }) => {
              const icon = <Icon width="26" height="26" />;
              return (
                <li key={id} data-fx="magnetic">
                  {href ? (
                    <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer me">
                      {icon}
                    </a>
                  ) : (
                    <ProtectedEmailLink encoded={CONTACT_EMAIL} label={label}>
                      {icon}
                    </ProtectedEmailLink>
                  )}
                  <span className="dock__tip" aria-hidden="true">
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      </main>

      <footer className="colophon">
        <details>
          <summary>Built with modern CSS — how does your browser score?</summary>
          <ul className="features">
            {features.map(({ id, name }) => (
              <li key={id} data-feature={id}>
                {name}
              </li>
            ))}
          </ul>
        </details>
      </footer>
    </>
  );
}
