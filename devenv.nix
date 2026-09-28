{ pkgs, lib, config, ... }:

{
  # Runtime: Node 24 LTS runs Next.js / Vitest / Playwright; Bun is the package manager
  # and script runner. Versions match `.node-version` and `packageManager` in package.json.
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    bun = {
      enable = true;
      install.enable = true; # `bun install` on shell entry when bun.lock changes
    };
  };

  packages = [ pkgs.git ];

  env = {
    NEXT_TELEMETRY_DISABLED = "1";
  }
  # Nix-provided Chromium for Vitest browser mode + Playwright on Linux (downloaded
  # Playwright browsers don't run on NixOS). On macOS run `playwright:install` once.
  // lib.optionalAttrs pkgs.stdenv.isLinux {
    PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = lib.getExe pkgs.chromium;
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
  };

  scripts = {
    dev.exec = "bun run dev";
    check.exec = "bun run check";
    e2e.exec = "bun run build && bun run test:e2e";
    "playwright:install".exec = "bunx playwright install chromium";
  };

  # `devenv up` — runs the dev server (add more processes here as the site grows).
  processes.web.exec = "bun run dev";

  git-hooks.hooks = {
    oxfmt = {
      enable = true;
      name = "oxfmt";
      entry = "bunx oxfmt --check";
      files = "\\.(ts|tsx|js|mjs|json|css|md|ya?ml)$";
    };
    oxlint = {
      enable = true;
      name = "oxlint";
      entry = "bunx oxlint --deny-warnings";
      files = "\\.(ts|tsx|js|mjs)$";
    };
    stylelint = {
      enable = true;
      name = "stylelint";
      entry = "bunx stylelint";
      files = "\\.css$";
    };
    typecheck = {
      enable = true;
      name = "tsc";
      entry = "bun run typecheck";
      pass_filenames = false;
      files = "\\.(ts|tsx)$";
    };
  };

  enterShell = ''
    echo "solc.dev · node $(node --version) · bun $(bun --version)"
    echo "  dev · check · e2e · devenv up"
  '';

  # `devenv test` — what CI runs, locally.
  enterTest = ''
    bun run check
  '';
}
