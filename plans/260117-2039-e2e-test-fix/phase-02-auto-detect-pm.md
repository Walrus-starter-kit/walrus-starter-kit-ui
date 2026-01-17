# Phase 2: Auto-detect Package Manager in Non-Interactive Mode

## Overview

**Priority**: P2 (MEDIUM)
**Effort**: 20 minutes
**Status**: Pending

Enhance CLI to auto-detect package manager when running in non-interactive mode (CI/CD, scripts, tests without TTY).

## Context Links

- Main Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 1: Fix E2E Tests](./phase-01-fix-e2e-tests.md)
- Next Phase: [Phase 3: Improve Error Handling](./phase-03-improve-error-handling.md)

## Key Insights

- Phase 1 fixes immediate issue (E2E tests)
- This phase improves CLI UX for non-interactive environments
- Auto-detection already exists in `detectPackageManager()`
- Need to check for TTY and use detected PM if no stdin

## Requirements

### Functional
- Detect when running in non-interactive mode (`!process.stdin.isTTY`)
- Auto-fill `packageManager` using `detectPackageManager()` function
- Preserve interactive prompt behavior when TTY available
- Work correctly in CI/CD pipelines (GitHub Actions, GitLab CI, etc.)

### Non-functional
- No breaking changes to CLI interface
- Maintain backward compatibility
- Clear logging when auto-detecting

## Architecture

**Current Flow**:
```
User runs CLI → Prompts → Package Manager prompt → User selects → Continue
```

**New Flow**:
```
User runs CLI → Check if interactive
  ├─ TTY available → Show prompt → User selects → Continue
  └─ No TTY → Auto-detect PM → Log choice → Continue
```

## Related Code Files

**Modify**:
- `packages/cli/src/prompts.ts` (lines 7-122)

**Reference**:
- `packages/cli/src/utils/detect-pm.ts` (existing detection logic)

## Implementation Steps

### Step 1: Detect non-interactive mode

**Location**: `packages/cli/src/prompts.ts` - Add after imports, before `runPrompts` function

**Add New Code** (after line 5, before line 7):
```typescript
/**
 * Check if running in interactive mode (has TTY)
 */
function isInteractive(): boolean {
  return process.stdin.isTTY === true;
}
```

**Rationale**: Centralize TTY detection logic for clarity and testability.

---

### Step 2: Auto-fill package manager in non-interactive mode

**Location**: `packages/cli/src/prompts.ts:7-9`

**Current Code**:
```typescript
export async function runPrompts(
  initial: Partial<Context> = {}
): Promise<Partial<Context>> {
```

**Updated Code**:
```typescript
export async function runPrompts(
  initial: Partial<Context> = {}
): Promise<Partial<Context>> {
  // Auto-detect package manager in non-interactive environments
  if (!isInteractive() && !initial.packageManager) {
    const detected = detectPackageManager();
    console.log(`📦 Non-interactive mode: using detected package manager "${detected}"`);
    initial.packageManager = detected;
  }
```

**Rationale**:
- Check TTY before showing prompts
- Only auto-fill if not already provided via CLI flag
- Log choice for transparency in CI/CD logs

---

### Step 3: Verify prompt logic still works

**Location**: `packages/cli/src/prompts.ts:92-106`

**No changes needed** - existing logic already handles `initial.packageManager`:

```typescript
{
  type: initial.packageManager ? null : 'select',  // ← Skips prompt if set
  name: 'packageManager',
  message: 'Choose package manager:',
  ...
}
```

**Verification**: When `initial.packageManager` is set (from Step 2), prompt is skipped (`type: null`).

---

### Step 4: Update imports (if needed)

**Location**: `packages/cli/src/prompts.ts:1-5`

**Current Imports**:
```typescript
import prompts from 'prompts';
import { Context } from './types.js';
import { COMPATIBILITY_MATRIX, SDK_METADATA } from './matrix.js';
import { validateProjectName } from './validator.js';
import { detectPackageManager } from './utils/detect-pm.js';
```

**Verification**: `detectPackageManager` already imported ✅

---

### Step 5: Add test comment for future maintainers

**Location**: `packages/cli/src/prompts.ts` - Add JSDoc to `runPrompts` function

**Updated Function Signature**:
```typescript
/**
 * Run interactive prompts or auto-fill from initial context.
 *
 * In non-interactive mode (no TTY), package manager is auto-detected
 * to prevent prompt cancellation in CI/CD environments.
 *
 * @param initial - Pre-filled context from CLI flags
 * @returns Complete context with user selections or auto-detected values
 */
export async function runPrompts(
  initial: Partial<Context> = {}
): Promise<Partial<Context>> {
```

## Complete Modified Function

**File**: `packages/cli/src/prompts.ts`

```typescript
import prompts from 'prompts';
import { Context } from './types.js';
import { COMPATIBILITY_MATRIX, SDK_METADATA } from './matrix.js';
import { validateProjectName } from './validator.js';
import { detectPackageManager } from './utils/detect-pm.js';

/**
 * Check if running in interactive mode (has TTY)
 */
function isInteractive(): boolean {
  return process.stdin.isTTY === true;
}

/**
 * Run interactive prompts or auto-fill from initial context.
 *
 * In non-interactive mode (no TTY), package manager is auto-detected
 * to prevent prompt cancellation in CI/CD environments.
 *
 * @param initial - Pre-filled context from CLI flags
 * @returns Complete context with user selections or auto-detected values
 */
export async function runPrompts(
  initial: Partial<Context> = {}
): Promise<Partial<Context>> {
  // Auto-detect package manager in non-interactive environments
  if (!isInteractive() && !initial.packageManager) {
    const detected = detectPackageManager();
    console.log(`📦 Non-interactive mode: using detected package manager "${detected}"`);
    initial.packageManager = detected;
  }

  const response = await prompts(
    [
      // ... existing prompts (no changes)
    ],
    {
      onCancel: () => {
        console.log('\nOperation cancelled.');
        process.exit(0);
      },
    }
  );

  if (!response.projectName && !initial.projectName) {
    console.log('\nOperation cancelled.');
    process.exit(0);
  }

  return { ...initial, ...response };
}
```

## Todo List

- [ ] Add `isInteractive()` helper function after imports
- [ ] Add non-interactive check at start of `runPrompts()`
- [ ] Auto-detect and set `initial.packageManager` when no TTY
- [ ] Add console.log for transparency in CI/CD
- [ ] Add JSDoc comments to `runPrompts()` function
- [ ] Verify existing prompt logic unchanged
- [ ] Test in interactive mode (should show prompts)
- [ ] Test in non-interactive mode (should auto-detect)

## Success Criteria

- ✅ CLI works in CI/CD without `-p` flag (auto-detects)
- ✅ Interactive mode still shows package manager prompt
- ✅ Non-interactive mode logs detected package manager
- ✅ E2E tests pass without modifications (Phase 1 already added `-p npm`)
- ✅ No breaking changes to CLI interface

## Verification Steps

1. **Test Interactive Mode** (with TTY):
   ```bash
   node packages/cli/dist/index.js test-interactive
   ```
   Expected: Shows all prompts including package manager selection

2. **Test Non-Interactive Mode** (without TTY):
   ```bash
   echo "" | node packages/cli/dist/index.js test-non-interactive --sdk mysten --framework react --use-case simple-upload --skip-install --skip-git
   ```
   Expected: Logs "📦 Non-interactive mode: using detected package manager \"npm\"" and creates project

3. **Test CI/CD Simulation** (using env variable):
   ```bash
   CI=true node packages/cli/dist/index.js test-ci --sdk mysten --framework react --use-case simple-upload --skip-install --skip-git
   ```
   Expected: Auto-detects package manager, no prompt shown

4. **Test Explicit Flag Override**:
   ```bash
   echo "" | node packages/cli/dist/index.js test-override --sdk mysten --framework react --use-case simple-upload -p pnpm --skip-install --skip-git
   ```
   Expected: Uses `pnpm` (from flag), not auto-detected value

## Risk Assessment

**Low Risk**:
- Only adds auto-detection, doesn't remove prompts
- Preserves existing behavior when TTY available
- Flag override still works (`-p` takes precedence)

**Mitigation**:
- Test both interactive and non-interactive modes
- Verify CI/CD compatibility (GitHub Actions)
- Check edge cases (Docker containers, SSH sessions)

## Security Considerations

- Auto-detection uses safe environment variable check (`npm_config_user_agent`)
- No new dependencies or external calls
- Fallback to `npm` if detection fails (existing logic)

## Next Steps

After completion:
- Proceed to [Phase 3: Improve Error Handling](./phase-03-improve-error-handling.md)
- Test in actual CI/CD environment (GitHub Actions)
- Consider adding `--no-interactive` flag for explicit control (future enhancement)
