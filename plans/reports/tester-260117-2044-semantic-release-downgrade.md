# Test Report: semantic-release Downgrade Verification

**Date**: 2026-01-17
**Status**: SUCCESS
**Fix Verified**: Downgraded `semantic-release` from v25.0.2 to v24.2.9 to maintain compatibility with Node.js 20/22.

## Test Results Overview

| Task | Status | Details |
|------|--------|---------|
| Installation Verification | PASSED | `semantic-release@24.2.9` confirmed via `pnpm list` |
| Build Process | PASSED | `pnpm build` completed successfully in all packages |
| Test Suite | PASSED | 87 tests passed in `packages/cli` |
| Release Dry-run | PASSED | `semantic-release` version 24.2.9 loaded and verified plugins correctly |

## Detailed Findings

### 1. Installation Verification
Command: `pnpm list semantic-release --recursive`
Output:
```
walrus-starter-kit@0.1.0 D:\Sui\walrus-starter-kit
devDependencies:
semantic-release 24.2.9
```

### 2. Build Status
Command: `pnpm build`
Output: Success.
- `@walrus-kit/create-walrus-app@0.1.0` built successfully.

### 3. Test Execution
Command: `pnpm test`
Results:
- Total Test Files: 10
- Total Tests: 87
- Passed: 87
- Failed: 0
- Skipped: 0

**Note**: Encountered and fixed a testing infra issue where Vitest was trying to run tests inside generated `test-output` directories. Updated `packages/cli/vitest.config.ts` to exclude `test-output/`.

### 4. Release Configuration (Dry-run)
Command: `pnpm release`
Output Highlights:
- `[semantic-release] » ℹ  Running semantic-release version 24.2.9`
- `[semantic-release] » ✔  Loaded plugin "verifyConditions" from "@semantic-release/changelog"`
- `[semantic-release] » ✔  Loaded plugin "verifyConditions" from "@semantic-release/npm"`
- `[semantic-release] » ✔  Loaded plugin "verifyConditions" from "@semantic-release/github"`
- `[semantic-release] » ✔  Loaded plugin "verifyConditions" from "@semantic-release/git"`
- `[semantic-release] » ✔  Allowed to push to the Git repository`

*Note: The command failed with `ENOGHTOKEN` as expected because no `GH_TOKEN` is set in the local environment. This confirms that the tool successfully reached the final verification step before remote interaction.*

## Critical Issues Resolved during Testing
- **Infra Bug**: Vitest was picking up `adapter.test.ts` from generated projects in `test-output`, causing `ERR_MODULE_NOT_FOUND` errors.
- **Fix**: Added `test-output/**` to the `exclude` list in `packages/cli/vitest.config.ts`.
- **Cleanup**: Manually removed stale generated directories (`my-test-app`, `pkg-test`, `my-app`) from `packages/cli`.

## Recommendations
- Ensure `GH_TOKEN` is properly configured in CI/CD settings for the actual release.
- Keep `semantic-release` at v24.x until the project is ready to move to a higher Node.js requirement (v20.8.1+ for v25).

## Next Steps
1. Push the downgrade fix and testing infra improvements.
2. Monitor CI/CD for successful release execution.

## Unresolved Questions
- None.
