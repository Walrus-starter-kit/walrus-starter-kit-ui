# CI Node.js Version Incompatibility Analysis

**Report Date:** 2026-01-17
**Debugger ID:** aa0b1dc
**GitHub Actions Run:** 21095206064
**Status:** FAILED

---

## Executive Summary

**Root Cause:** GitHub Actions workflows configured with Node.js v20.19.6, incompatible with semantic-release@25.0.2 requiring `^22.14.0 || >= 24.10.0`

**Business Impact:**
- All CI jobs failing on `pnpm install` step
- Blocks: builds, tests, releases, type checking
- Zero successful pipeline runs

**Immediate Fix:** Downgrade semantic-release to v24.2.9 (recommended) OR upgrade Node.js to v22/v24

---

## Technical Analysis

### 1. Error Pattern

All 7 CI jobs failed identically:

```
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment (bad pnpm and/or Node.js version)

Your Node version is incompatible with "semantic-release@25.0.2(typescript@5.9.3)".

Expected version: ^22.14.0 || >= 24.10.0
Got: v20.19.6
```

**Affected Jobs:**
- Build
- Lint
- Unit Tests
- Integration Tests
- E2E Tests
- Type Check
- Validate Release Config

### 2. Workflow Configuration

**Location:** `.github/workflows/`

#### ci.yml
- **Path:** `d:\Sui\walrus-starter-kit\.github\workflows\ci.yml`
- **Jobs:** 6 (lint, unit-tests, integration-tests, e2e-tests, build, type-check, validate-release-config)
- **Node Version:** Line 24, 47, 77, 106, 132, 160, 183 → `node-version: '20'`
- **Platform:** ubuntu-latest
- **Package Manager:** pnpm@9

#### release.yml
- **Path:** `d:\Sui\walrus-starter-kit\.github\workflows\release.yml`
- **Jobs:** 1 (release)
- **Node Version:** Line 29 → `node-version: '20'`
- **Platform:** ubuntu-latest
- **Package Manager:** pnpm@9
- **Release Command:** `npx semantic-release` (line 45)

### 3. Dependency Versions

**Current State (Root package.json):**

```json
{
  "engines": {
    "node": "^20.0.0 || ^22.0.0 || >=24.0.0",
    "pnpm": ">=9.0.0"
  },
  "devDependencies": {
    "semantic-release": "^25.0.2",
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/commit-analyzer": "^13.0.1",
    "@semantic-release/git": "^10.0.1",
    "@semantic-release/github": "^12.0.2",
    "@semantic-release/npm": "^13.1.3",
    "@semantic-release/release-notes-generator": "^14.1.0"
  }
}
```

**CLI package.json engines:**

```json
{
  "engines": {
    "node": "^20.0.0 || ^22.0.0 || >=24.0.0",
    "pnpm": ">=9.0.0"
  },
  "devDependencies": {
    "vitest": "^4.0.17"
  }
}
```

### 4. Version Compatibility Matrix

| Package | Current Version | Node Requirement | Compatible with Node 20? |
|---------|----------------|------------------|-------------------------|
| semantic-release | 25.0.2 | ^22.14.0 \|\| >= 24.10.0 | ❌ NO |
| semantic-release | 24.2.9 | >=20.8.1 | ✅ YES |
| vitest | 4.0.17 | ^20.0.0 \|\| ^22.0.0 \|\| >=24.0.0 | ✅ YES |
| @semantic-release/commit-analyzer | 13.0.1 | semantic-release >=20.1.0 | ✅ YES (peer) |
| @semantic-release/release-notes-generator | 14.1.0 | semantic-release >=20.1.0 | ✅ YES (peer) |
| @semantic-release/npm | 13.1.3 | semantic-release >=20.1.0 | ✅ YES (peer) |

**Key Finding:** All semantic-release plugins support both v24 and v25, no plugin version changes needed

### 5. Timeline of Events

1. **Initial Setup:** semantic-release v25.0.2 added to dependencies
2. **CI Configuration:** Node v20 configured in workflows
3. **First Run (21095206064):** All jobs fail at `pnpm install` step
4. **Engine Check:** pnpm enforces engine constraints from semantic-release package manifest
5. **Hard Failure:** Installation aborts, no subsequent steps execute

---

## Root Cause Identification

### Primary Issue

**Version Mismatch:** semantic-release v25.0.2 introduced breaking change raising minimum Node.js from v20.8.1 (v24) to v22.14.0/v24.10.0 (v25)

### Contributing Factors

1. **Workflow Static Version:** Workflows use `node-version: '20'` (shorthand) → resolves to latest Node 20.x (currently 20.19.6)
2. **Package Engine Constraints:** Root package.json engines field allows Node 20: `"^20.0.0 || ^22.0.0 || >=24.0.0"`
3. **pnpm Strict Enforcement:** pnpm respects engine constraints by default, fails fast on mismatch
4. **Dependency Version Pinning:** `^25.0.2` in package.json locks to v25 minor range

### Why This Happened

- semantic-release v25 released with stricter Node requirements
- CI workflows not updated to match
- Local development likely uses Node 22+ (no error locally)
- Engine field in package.json permits Node 20 (misleading)

---

## Solution Analysis

### Option A: Downgrade semantic-release to v24 (RECOMMENDED)

**Changes Required:**
1. Update `package.json` devDependencies:
   ```json
   "semantic-release": "^24.2.9"
   ```
2. Run `pnpm install` to update lockfile
3. No workflow changes needed

**Pros:**
- Minimal changes (1 version bump)
- Maintains Node 20 support
- All plugins compatible with v24
- Immediate fix, low risk
- Aligns with existing infrastructure

**Cons:**
- Uses older semantic-release version
- Misses v25 features (if any critical)

**Risk Level:** LOW
**Effort:** 5 minutes
**Impact:** Resolves all CI failures immediately

---

### Option B: Upgrade Node.js to v22

**Changes Required:**
1. Update all workflow files (7 instances):
   ```yaml
   node-version: '22'
   ```
   - `.github/workflows/ci.yml`: Lines 24, 47, 77, 106, 132, 160, 183
   - `.github/workflows/release.yml`: Line 29

2. Update engine constraints in both package.json files:
   ```json
   "engines": {
     "node": "^22.0.0 || >=24.0.0",
     "pnpm": ">=9.0.0"
   }
   ```

3. Test locally with Node 22
4. Update documentation/README with new Node requirement

**Pros:**
- Uses latest semantic-release features
- Future-proof for upcoming dependencies
- Aligns with semantic-release roadmap

**Cons:**
- Breaking change for developers on Node 20
- Requires local environment updates
- More testing required
- Potential compatibility issues with other tooling

**Risk Level:** MEDIUM
**Effort:** 30-60 minutes
**Impact:** Requires developer environment migration

---

### Option C: Upgrade Node.js to v24 (LTS)

**Changes Required:** Same as Option B, but use `node-version: '24'`

**Pros:**
- LTS version (better long-term stability)
- Satisfies semantic-release v25 requirements
- Future-proof

**Cons:**
- Same as Option B
- Node 24 newer, may have less ecosystem maturity

**Risk Level:** MEDIUM
**Effort:** 30-60 minutes

---

## Recommendations

### Primary Recommendation: **Option A - Downgrade to semantic-release v24.2.9**

**Rationale:**
1. **Minimal Disruption:** No developer environment changes required
2. **Low Risk:** Well-tested version, mature ecosystem
3. **Immediate Fix:** Single dependency change
4. **Backward Compatible:** All plugins support v24
5. **Pragmatic:** Node 20 LTS still supported until 2026-04-30

**Implementation Steps:**
1. Edit `d:\Sui\walrus-starter-kit\package.json`:
   ```diff
   - "semantic-release": "^25.0.2",
   + "semantic-release": "^24.2.9",
   ```
2. Run: `pnpm install`
3. Commit: `fix(deps): downgrade semantic-release to v24 for Node 20 compatibility`
4. Push and verify CI passes

### Secondary Recommendation: **Option B - Upgrade to Node 22** (Long-term)

**Timeline:** Consider for next major version bump
**Prerequisites:**
- Team alignment on Node version
- Local testing across all developer machines
- Update CI/CD documentation

---

## Evidence

### Log Excerpts

**Build Job Failure (line 157-160):**
```
Your Node version is incompatible with "semantic-release@25.0.2(typescript@5.9.3)".

Expected version: ^22.14.0 || >= 24.10.0
Got: v20.19.6
```

**Package Engine Requirements:**
```bash
$ pnpm info semantic-release@25.0.2 engines
{ node: '^22.14.0 || >= 24.10.0' }

$ pnpm info semantic-release@24.2.9 engines
{ node: '>=20.8.1' }

$ pnpm info vitest@4.0.17 engines
{ node: '^20.0.0 || ^22.0.0 || >=24.0.0' }
```

### Workflow File Paths

1. `d:\Sui\walrus-starter-kit\.github\workflows\ci.yml`
2. `d:\Sui\walrus-starter-kit\.github\workflows\release.yml`

### Node Version Settings (ci.yml)

| Job | Line | Setting |
|-----|------|---------|
| lint | 24 | `node-version: '20'` |
| unit-tests | 47 | `node-version: '20'` |
| integration-tests | 77 | `node-version: '20'` |
| e2e-tests | 106 | `node-version: '20'` |
| build | 132 | `node-version: '20'` |
| type-check | 160 | `node-version: '20'` |
| validate-release-config | 183 | `node-version: '20'` |

### Node Version Settings (release.yml)

| Job | Line | Setting |
|-----|------|---------|
| release | 29 | `node-version: '20'` |

---

## Security Considerations

### Downgrade Option
- ✅ No security concerns
- semantic-release v24.2.9 released 2024-12, actively maintained
- All plugins compatible

### Upgrade Option
- ✅ Benefits from Node 22/24 security improvements
- Requires validation of all dependencies with newer Node

---

## Next Steps (If Proceeding with Option A)

1. ✅ **Update package.json** semantic-release version
2. ✅ **Run pnpm install** to update lockfile
3. ✅ **Test locally:** `pnpm build && pnpm test`
4. ✅ **Commit changes** with conventional commit message
5. ✅ **Push to GitHub** and monitor CI pipeline
6. ✅ **Verify all jobs pass** (Build, Lint, Tests, Type Check, Validate Release Config)
7. ✅ **Update release.yml** test with `pnpm release` dry-run
8. ✅ **Document decision** in changelog/release notes

---

## Unresolved Questions

1. **Feature Gap:** Are there critical features in semantic-release v25 needed for this project?
2. **Migration Timeline:** When should project migrate to Node 22/24?
3. **Testing:** Should we add Node version validation in pre-commit hooks?
4. **Documentation:** Does README.md specify Node version requirements? (needs update if choosing Option B/C)
5. **Vitest 4.x:** Any other dependencies requiring Node 22+ in future?

---

## References

- GitHub Actions Run: https://github.com/blu1606/walrus-starter-kit/actions/runs/21095206064
- semantic-release v25 release notes: https://github.com/semantic-release/semantic-release/releases/tag/v25.0.0
- semantic-release v24 changelog: https://github.com/semantic-release/semantic-release/releases/tag/v24.2.9
- Node.js release schedule: https://nodejs.org/en/about/previous-releases
- pnpm engines configuration: https://pnpm.io/package_json#engines
