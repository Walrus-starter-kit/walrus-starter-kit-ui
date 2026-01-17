# Code Review Report: Import Path Fix

**Reviewer:** code-reviewer (a887319)
**Date:** 2026-01-17 23:54
**Phase:** phase-01-fix-import-paths
**Score:** 3/10 ❌

---

## Scope

- **Files Reviewed:** 5 files in `packages/cli/templates/sdk-mysten/src/`
  - adapter.ts
  - client.ts
  - config.ts
  - index.ts
  - types.ts
- **Lines Changed:** 5 import statements
- **Review Focus:** Import path corrections after template flattening
- **Updated Plans:** None

---

## Overall Assessment

**CRITICAL FAILURE:** Import paths changed from `../` to `./` but referenced subdirectories (`./adapters/`, `./utils/`, `./types/`) **DO NOT EXIST**. Directory scan confirms only `src/` and `test/` exist—no subdirectories under `src/`.

Changes compile because TypeScript hasn't resolved paths yet, but will **fail at runtime** or when modules are actually imported.

---

## Critical Issues

### 1. **Non-Existent Import Paths (BREAKING)**
**Severity:** CRITICAL
**Files:** adapter.ts, client.ts, config.ts, index.ts

**Problem:**
All changed imports reference subdirectories that don't exist:
```typescript
// adapter.ts:6 & index.ts:11
from './adapters/storage.js'  // ❌ No ./adapters/ directory exists

// client.ts:3
from './utils/env.js'  // ❌ No ./utils/ directory exists

// client.ts:5 & config.ts:1
from './types/walrus.js'  // ❌ No ./types/ directory exists
```

**Directory Structure (Actual):**
```
sdk-mysten/
├── src/
│   ├── adapter.ts
│   ├── client.ts
│   ├── config.ts
│   ├── index.ts
│   └── types.ts  ← Flat structure, no subdirs
└── test/
```

**Impact:**
- Runtime module resolution will fail
- Imports will throw "Module not found" errors
- Template is completely broken

**Required Fix:**
Need to locate actual files:
- Where is `storage.js/storage.ts` defining `StorageAdapter`?
- Where is `env.js/env.ts` defining `loadEnv`?
- Where is `walrus.js/walrus.ts` defining `WalrusNetwork`?

If files don't exist, imports should reference:
- `./types.js` for `WalrusNetwork` (types.ts exists)
- Need to create missing files OR import from actual locations

---

## High Priority Findings

### 2. **Missing Source Files**
**Severity:** HIGH

Files imported but not found in scan:
- `adapters/storage.ts` (or `.js`)
- `utils/env.ts` (or `.js`)
- `types/walrus.ts` (or `.js`)

Either:
1. Files were deleted during flattening (breaking change)
2. Files exist elsewhere and paths wrong
3. Files need to be created

**Action:** Search entire template for these files.

---

### 3. **No Verification of Module Resolution**
**Severity:** HIGH

Claimed "TypeScript compilation check passed" but:
- No actual import resolution occurred
- No runtime verification
- No test execution shown

**Action:** Run full build + tests to verify imports resolve.

---

## Medium Priority Improvements

### 4. **Inconsistent Module Extensions**
All imports use `.js` extension but source files are `.ts`. While valid for ESM TypeScript, verify `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
```

---

### 5. **YAGNI Violation: Over-Correction**
Changed ALL `../` to `./` without verifying directory structure. Should have:
1. Scanned directories first
2. Identified actual file locations
3. Then corrected paths

Violates KISS principle—fix was based on assumption, not verification.

---

## Low Priority Suggestions

None—must fix critical issues first.

---

## Positive Observations

- Consistent `.js` extension usage in imports (ESM compliance)
- Error handling in adapter.ts is comprehensive
- Type safety maintained (uses `type` imports correctly)

---

## Recommended Actions

**IMMEDIATE (BLOCKING):**

1. **Locate Missing Files**
   ```bash
   find packages/cli/templates -name "storage.*" -o -name "env.*" -o -name "walrus.*"
   ```

2. **Determine Correct Structure**
   - If files in parent dir: use `../file.js`
   - If files in src: use `./file.js`
   - If files in subdirs: create subdirs OR flatten imports

3. **Fix Import Paths (Example)**
   ```typescript
   // If types/walrus.ts exists at root level:
   from '../../types/walrus.js'

   // If WalrusNetwork is in types.ts:
   from './types.js'
   ```

4. **Verify Build**
   ```bash
   cd packages/cli/templates/sdk-mysten
   npm run build  # Must succeed
   npm test       # Must pass
   ```

5. **Update Plan Status**
   Mark phase-01 as FAILED until imports verified working.

---

## Metrics

- **Type Coverage:** N/A (imports broken)
- **Test Coverage:** Not run (blocked by imports)
- **Linting Issues:** N/A (compilation would fail)
- **Build Status:** ❌ WILL FAIL at module resolution

---

## Unresolved Questions

1. Where are original `storage.ts`, `env.ts`, `walrus.ts` files located?
2. Was template structure intentionally flattened or incomplete migration?
3. Does `types.ts` contain `WalrusNetwork` or is it in separate file?
4. Why did TypeScript compilation claim success with missing modules?
5. Are there other templates with similar broken imports?

---

## Next Steps

**BLOCK ALL DOWNSTREAM WORK** until imports fixed. Must:
1. Find or create missing source files
2. Correct ALL import paths based on actual structure
3. Run full test suite to verify
4. Update phase-01 plan with actual status

**Estimated Fix Time:** 15-30 min (depends on file locations)
