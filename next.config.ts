import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Type checking runs separately with TypeScript 7 (native `tsc`), which no longer
  // ships the JS compiler API that `next build` uses for its built-in check.
  typescript: { ignoreBuildErrors: true },
};

export default config;
