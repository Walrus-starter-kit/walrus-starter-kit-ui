# Investigation Report: @mysten/walrus Dependency Version Mismatch

## Executive Summary
The project is currently experiencing `ERR_PNPM_NO_MATCHING_VERSION` because three `package.json` files specify `@mysten/walrus@^1.0.0`, but the highest stable version available on npm is `0.9.0`. There is no `1.0.0` version, even in experimental tags.

## Technical Analysis
- **Root Cause**: Hardcoded dependency on non-existent version `^1.0.0` in template files and debug packages.
- **NPM Investigation**:
    - `latest`: `0.9.0`
    - `experimental`: `0.0.0-experimental-20251202045132`
    - No `1.x` versions exist in the version history.
- **Affected Files**:
    1. `templates/sdk-mysten/package.json`
    2. `packages/cli/templates/sdk-mysten/package.json`
    3. `debug-test/package.json`
- **Code Impact**:
    - The code in `src/client.ts` for these packages uses `WalrusClient` from `@mysten/walrus`.
    - `WalrusClient` constructor signature in `0.9.0` is compatible with the current usage:
      ```typescript
      new WalrusClient({
        network,
        suiClient,
        ...
      })
      ```
    - Since the project aims to be a "Starter Kit", using the `latest` stable version (0.9.0) is more appropriate than experimental builds unless specific new features are required.

## Actionable Recommendations
1. **Immediate Fix**: Downgrade `@mysten/walrus` from `^1.0.0` to `^0.9.0` in all affected `package.json` files.
2. **Template Synchronization**: Ensure `packages/cli/templates/sdk-mysten/package.json` and `templates/sdk-mysten/package.json` remain in sync.
3. **Verification**: Run `pnpm install` after the change to verify resolution.

## Recommended Fix Strategy
Replace all instances of `"@mysten/walrus": "^1.0.0"` with `"@mysten/walrus": "^0.9.0"`.

---
**Unresolved Questions:**
- Was there an internal/private `1.0.0` release intended that hasn't been published yet? (Assuming no, based on public registry).
- Should we use the `experimental` version instead if the kit requires features not in `0.9.0`? (Current code analysis suggests `0.9.0` is sufficient).
