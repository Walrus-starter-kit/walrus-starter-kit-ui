# Phase 3: Improve Error Handling

## Overview

**Priority**: P3 (LOW)
**Effort**: 15 minutes
**Status**: Pending

Improve `onCancel` handler to use proper exit code and provide helpful error messages for debugging.

## Context Links

- Main Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 2: Auto-detect Package Manager](./phase-02-auto-detect-pm.md)
- Next Phase: [Phase 4: Verification & Testing](./phase-04-verification.md)

## Key Insights

- Current `onCancel` uses `exit(0)` (success code) - misleading
- Silent failures make debugging difficult in CI/CD
- Error messages should guide users to solutions
- Exit code 1 ensures CI/CD detects failures properly

## Requirements

### Functional
- Exit with code 1 (error) instead of 0 (success)
- Log to stderr instead of stdout for proper error stream
- Provide helpful hint about non-interactive mode
- Distinguish between user cancellation and environment issues

### Non-functional
- Maintain existing cancellation behavior (process exits)
- Improve developer experience (DX) for debugging
- Clear error messages for CI/CD logs

## Related Code Files

**Modify**:
- `packages/cli/src/prompts.ts` (lines 108-113)

## Implementation Steps

### Step 1: Update onCancel handler exit code and messaging

**Location**: `packages/cli/src/prompts.ts:108-113`

**Current Code**:
```typescript
{
  onCancel: () => {
    console.log('\nOperation cancelled.');
    process.exit(0);
  },
}
```

**Updated Code**:
```typescript
{
  onCancel: () => {
    console.error('\n❌ Operation cancelled.');
    console.error('💡 Hint: In non-interactive environments (CI/CD), use -p flag to specify package manager.');
    console.error('   Example: create-walrus-app my-app -p npm');
    process.exit(1);
  },
}
```

**Changes**:
- `console.log` → `console.error` (proper error stream for CI/CD)
- Added helpful hint with example command
- `exit(0)` → `exit(1)` (proper error code for shell scripts, CI/CD)

**Rationale**:
- **stderr**: CI/CD tools differentiate stdout (logs) from stderr (errors)
- **Exit code 1**: Shell scripts check `$?` - should be non-zero for failures
- **Helpful hint**: Guides users to solution (`-p` flag)
- **Example**: Shows correct syntax immediately

---

### Step 2: Update secondary exit handler

**Location**: `packages/cli/src/prompts.ts:116-119`

**Current Code**:
```typescript
if (!response.projectName && !initial.projectName) {
  console.log('\nOperation cancelled.');
  process.exit(0);
}
```

**Updated Code**:
```typescript
if (!response.projectName && !initial.projectName) {
  console.error('\n❌ Operation cancelled.');
  process.exit(1);
}
```

**Rationale**: Consistency with main `onCancel` handler.

---

### Step 3: Add error context for debugging

**Optional Enhancement**: Add environment info to error messages for better debugging

**Location**: After `onCancel` error messages

**Enhanced Version** (optional):
```typescript
{
  onCancel: () => {
    console.error('\n❌ Operation cancelled.');

    if (!process.stdin.isTTY) {
      console.error('⚠️  Detected non-interactive environment (no TTY).');
      console.error('💡 Solutions:');
      console.error('   1. Use -p flag: create-walrus-app my-app -p npm');
      console.error('   2. Provide all required flags to skip prompts');
    } else {
      console.error('💡 User cancelled the operation.');
    }

    process.exit(1);
  },
}
```

**Recommendation**: Start with simple version (Step 1), add enhancement if needed based on user feedback.

## Complete Modified Code

**File**: `packages/cli/src/prompts.ts` (lines 108-122)

```typescript
  const response = await prompts(
    [
      // ... existing prompts
    ],
    {
      onCancel: () => {
        console.error('\n❌ Operation cancelled.');
        console.error('💡 Hint: In non-interactive environments (CI/CD), use -p flag to specify package manager.');
        console.error('   Example: create-walrus-app my-app -p npm');
        process.exit(1);
      },
    }
  );

  if (!response.projectName && !initial.projectName) {
    console.error('\n❌ Operation cancelled.');
    process.exit(1);
  }

  return { ...initial, ...response };
}
```

## Todo List

- [ ] Update `onCancel` handler to use `console.error`
- [ ] Add helpful hint message with example
- [ ] Change `exit(0)` to `exit(1)` in `onCancel`
- [ ] Update secondary exit handler (line 117)
- [ ] Change secondary `exit(0)` to `exit(1)`
- [ ] Test error output in terminal (should show in red/stderr)
- [ ] Test exit code (`echo $?` after cancellation should be 1)

## Success Criteria

- ✅ Cancelled operations exit with code 1
- ✅ Error messages appear in stderr (not stdout)
- ✅ Helpful hint guides users to solution
- ✅ CI/CD detects failures properly
- ✅ Example command is accurate and clear

## Verification Steps

### 1. Test User Cancellation (Interactive)

**Command**:
```bash
node packages/cli/dist/index.js test-cancel
# Press Ctrl+C or ESC when prompt appears
echo "Exit code: $?"
```

**Expected Output**:
```
❌ Operation cancelled.
💡 Hint: In non-interactive environments (CI/CD), use -p flag to specify package manager.
   Example: create-walrus-app my-app -p npm
Exit code: 1
```

---

### 2. Test Non-Interactive Failure (No TTY)

**Command**:
```bash
echo "" | node packages/cli/dist/index.js test-no-tty 2>&1 | tee output.log
echo "Exit code: $?"
```

**Expected**:
- Exit code: 1 (with Phase 1 fix, this won't trigger if `-p npm` provided)
- Error appears in stderr stream
- CI/CD marks step as failed

---

### 3. Test in CI/CD Simulation

**GitHub Actions Example**:
```yaml
- name: Test CLI cancellation
  run: |
    echo "" | node packages/cli/dist/index.js test-ci || EXIT_CODE=$?
    if [ $EXIT_CODE -ne 1 ]; then
      echo "Expected exit code 1, got $EXIT_CODE"
      exit 1
    fi
```

Expected: CI step detects failure and shows error message

---

### 4. Verify stderr Output

**Command**:
```bash
node packages/cli/dist/index.js test-err 2>error.log 1>output.log
# Cancel operation
cat error.log
```

**Expected**: Error messages appear in `error.log`, not `output.log`

## Impact Analysis

### Before (Current Behavior)
- ❌ Exit code 0 → CI/CD thinks operation succeeded
- ❌ stdout messages → Mixed with normal logs
- ❌ No guidance → Users confused in CI/CD
- ❌ Silent failure → Hard to debug E2E tests

### After (New Behavior)
- ✅ Exit code 1 → CI/CD detects failure
- ✅ stderr messages → Separated from logs
- ✅ Helpful hints → Users know what to do
- ✅ Clear errors → Easy debugging in tests

## Risk Assessment

**Low Risk**:
- Exit code change is correct fix (current behavior is bug)
- Error messages improve UX, don't change logic
- No functional changes to prompt behavior

**Potential Issues**:
- Scripts relying on exit code 0 for cancellation (unlikely, incorrect assumption)
- Error message formatting in different terminals (minimal impact)

**Mitigation**:
- Document exit code behavior in README
- Test in common CI/CD platforms (GitHub Actions, GitLab CI)

## Security Considerations

None - only changes error handling and exit codes.

## Next Steps

After completion:
- Proceed to [Phase 4: Verification & Testing](./phase-04-verification.md)
- Run full E2E test suite
- Test in actual CI/CD pipeline
- Update documentation if needed
