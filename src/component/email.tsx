'use client';

import type { MouseEvent, ReactNode, SyntheticEvent } from 'react';

import { decodeEmail } from '@/lib/email';

type Props = {
  /** Output of `encodeEmail()` – the plain address never reaches the HTML. */
  encoded: string;
  label: string;
  className?: string;
  children: ReactNode;
};

/**
 * A mailto link that only materialises on human interaction. Hover/focus fills
 * in the real `href` (so the status bar and "copy link" work), click opens mail.
 */
export default function ProtectedEmailLink({ encoded, label, className, children }: Props) {
  const reveal = (event: SyntheticEvent<HTMLAnchorElement>) => {
    const link = event.currentTarget;
    if (!link.href.startsWith('mailto:')) link.href = `mailto:${decodeEmail(encoded)}`;
  };

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    reveal(event);
    event.preventDefault();
    window.location.href = event.currentTarget.href;
  };

  return (
    <a
      href="#contact"
      aria-label={label}
      className={className}
      data-protected-email=""
      onPointerEnter={reveal}
      onFocus={reveal}
      onTouchStart={reveal}
      onClick={open}
    >
      {children}
    </a>
  );
}
