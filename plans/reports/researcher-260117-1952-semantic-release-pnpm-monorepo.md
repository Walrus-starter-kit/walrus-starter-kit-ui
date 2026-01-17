# Research Report: Semantic-Release v23+ Setup in pnpm Monorepos (2026)

## Executive Summary
For 2026, the standard for releasing pnpm monorepos involves a hybrid approach using `semantic-release` with monorepo-specific plugins or dedicated orchestrators like `multi-semantic-release`. Key advancements include native NPM provenance support and tighter GitHub Actions integration for secure, verifiable releases.

## 1. Required Plugins & Dependencies
To support a robust monorepo workflow, the following plugins are essential:
- `@semantic-release/commit-analyzer`: Parses conventional commits.
- `@semantic-release/release-notes-generator`: Generates markdown notes.
- `@semantic-release/changelog`: Updates `CHANGELOG.md` in package roots.
- `@semantic-release/npm`: Handles versioning, `package.json` updates, and publishing (with provenance).
- `@semantic-release/github`: Creates GitHub releases and comments on PRs.
- `@semantic-release/git`: Commits version bumps and changelog updates back to the repo.
- `semantic-release-monorepo`: (Optional but recommended) Wraps `semantic-release` to handle package-specific tagging (`<pkg-name>-v<version>`).

## 2. NPM Publishing & Provenance
NPM provenance is now a hard requirement for high-security packages.
- **Config**: Set `"provenance": true` in the `@semantic-release/npm` plugin options.
- **GitHub Action**: Requires `permissions: id-token: write` and `contents: write`.
- **pnpm**: Ensure `pnpm-workspace.yaml` is correctly configured so `pnpm install` works in CI before release.

## 3. Monorepo Configuration Patterns
- **Package-specific `.releaserc`**: Each package in `packages/*` has its own configuration.
- **Root Orchestration**: Use a tool like `multi-semantic-release` or a custom script that iterates through packages.
- **Global Config**: Define common settings in a root `release.config.js` and extend them in sub-packages to maintain DRY.

## 4. Release Triggers (GitHub Actions)
- **Automatic**: Triggered on `push` to `main` or `master`.
- **Manual/Approval**: Use GitHub `environment` with protection rules for a "Review then Release" flow.
- **Path Filtering**: Use `on.push.paths` to avoid triggering releases for changes in unrelated packages or docs.

## 5. Security & Token Management
- **NPM_TOKEN**: Store as an encrypted GitHub Secret. Use "Granular Access Tokens" with specific scope.
- **GITHUB_TOKEN**: Use the default `secrets.GITHUB_TOKEN` provided by the workflow, ensuring it has `write` permissions for `contents` and `pull-requests`.

## 6. Conventional Commits & Patterns
Standard specification remains:
- `feat`: Minor (0.1.0)
- `fix`: Patch (0.0.1)
- `BREAKING CHANGE`: Major (1.0.0)
- `chore`, `docs`, `refactor`: No release (unless configured otherwise).

## Actionable Insights
1. **Infrastructure**: Use Node.js 22/24+ and pnpm 9+ for optimal performance.
2. **Provenance**: Always enable provenance to boost package trust scores.
3. **Workspace Protocol**: pnpm's `workspace:*` dependencies are automatically resolved by `@semantic-release/npm` during the versioning phase if configured correctly.

## Unresolved Questions
- Should the starter kit favor `multi-semantic-release` (more automated but external dependency) or a vanilla `semantic-release` loop?
- Is there a preference for `changesets` over `semantic-release` given the team's familiarity?

## Sources
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [NPM Provenance Guide](https://docs.npmjs.com/generating-provenance-statements)
- [pnpm Monorepo Best Practices 2026](https://pnpm.io/monorepo)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
