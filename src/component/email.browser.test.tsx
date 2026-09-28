import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { CONTACT_EMAIL, encodeEmail } from '@/lib/email';

import ProtectedEmailLink from './email';

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.]+/;

describe('<ProtectedEmailLink>', () => {
  it('renders no address until someone interacts with it', async () => {
    const { container } = await render(
      <ProtectedEmailLink encoded={CONTACT_EMAIL} label="Email">
        mail
      </ProtectedEmailLink>
    );
    expect(container.innerHTML).not.toMatch(EMAIL_PATTERN);
    expect(container.innerHTML).not.toContain('mailto:');

    const link = page.getByRole('link', { name: 'Email' });
    await userEvent.hover(link);
    await expect
      .element(link)
      .toHaveAttribute('href', expect.stringMatching(/^mailto:.+@solc\.dev$/));
  });

  it('reveals on keyboard focus too', async () => {
    await render(
      <ProtectedEmailLink encoded={encodeEmail('hi@example.org')} label="Say hi">
        hi
      </ProtectedEmailLink>
    );
    await userEvent.tab();
    await expect
      .element(page.getByRole('link', { name: 'Say hi' }))
      .toHaveAttribute('href', 'mailto:hi@example.org');
  });
});
