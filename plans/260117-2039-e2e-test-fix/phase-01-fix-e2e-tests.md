# Phase 1: Fix E2E Tests (Immediate)

## Overview

**Priority**: P1 (HIGH)
**Effort**: 10 minutes
**Status**: Pending

Add `-p npm` flag to all `execSync` CLI calls in E2E test suite to prevent package manager prompt in non-interactive mode.

## Context Links

- Main Plan: [plan.md](./plan.md)
- Test Report: [d:\Sui\walrus-starter-kit\plans\reports\tester-260117-2024-e2e-test-compilation-and-execution.md](../reports/tester-260117-2024-e2e-test-compilation-and-execution.md)
- Root Cause: [d:\Sui\walrus-starter-kit\plans\reports\debugger-260117-2031-e2e-test-root-cause-analysis.md](../reports/debugger-260117-2031-e2e-test-root-cause-analysis.md)

## Key Insights

- Missing `-p` flag causes CLI to show interactive prompt
- Non-interactive `execSync` triggers `onCancel` → silent exit(0)
- No files created → all assertions fail
- Adding `-p npm` bypasses prompt entirely

## Requirements

### Functional
- All 8 failing generation tests must pass
- Tests must create project files correctly
- "Non-empty directory" test must fail properly (not false positive)

### Non-functional
- No changes to CLI source code (test-only fix)
- Maintain test clarity and readability
- Use consistent flag across all tests

## Related Code Files

**Modify**:
- `packages/cli/tests/integration/cli.e2e.test.mjs` (lines 60, 80, 95, 116, 142, 161, 181, 220)

## Implementation Steps

### Step 1: Add `-p npm` to "Creates React project" test (Line 60)

**Location**: `packages/cli/tests/integration/cli.e2e.test.mjs:59-62`

**Current Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

**Updated Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

**Change**: Add `-p npm` after `--use-case simple-upload`

---

### Step 2: Add `-p npm` to "Package.json has correct name" test (Line 80)

**Location**: `packages/cli/tests/integration/cli.e2e.test.mjs:79-82`

**Current Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

**Updated Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

---

### Step 3: Add `-p npm` to "Package.json includes React dependencies" test (Line 95)

**Location**: `packages/cli/tests/integration/cli.e2e.test.mjs:94-97`

**Current Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

**Updated Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

---

### Step 4: Add `-p npm` to "Creates simple-upload use-case" test (Line 116)

**Location**: `packages/cli/tests/integration/cli.e2e.test.mjs:115-118`

**Current Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

**Updated Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

---

### Step 5: Add `-p npm` to "Creates gallery use-case" test (Line 142)

**Location**: `packages/cli/tests/integration/cli.e2e.test.mjs:141-144`

**Current Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case gallery --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

**Updated Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case gallery -p npm --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

---

### Step 6: Add `-p npm` to "Includes required configuration files" test (Line 161)

**Location**: `packages/cli/tests/integration/cli.e2e.test.mjs:160-163`

**Current Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

**Updated Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

---

### Step 7: Add `-p npm` to "Replaces template variables" test (Line 181)

**Location**: `packages/cli/tests/integration/cli.e2e.test.mjs:180-183`

**Current Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

**Updated Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8' }
);
```

---

### Step 8: Add `-p npm` to "Fails for non-empty directory" test (Line 220)

**Location**: `packages/cli/tests/integration/cli.e2e.test.mjs:219-222`

**Current Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8', stdio: 'pipe' }
);
```

**Updated Code**:
```javascript
execSync(
  `node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --no-tailwind --skip-git --skip-validation`,
  { cwd: TEMP_DIR, encoding: 'utf-8', stdio: 'pipe' }
);
```

**Critical**: This test expects failure. Now it will correctly fail at directory check, not prompt cancellation.

---

### Step 9: Verify changes

Run quick syntax check:
```bash
node packages/cli/tests/integration/cli.e2e.test.mjs --dry-run
```

## Todo List

- [ ] Add `-p npm` to line 60 (Creates React project test)
- [ ] Add `-p npm` to line 80 (Package.json name test)
- [ ] Add `-p npm` to line 95 (React dependencies test)
- [ ] Add `-p npm` to line 116 (Simple-upload use-case test)
- [ ] Add `-p npm` to line 142 (Gallery use-case test)
- [ ] Add `-p npm` to line 161 (Config files test)
- [ ] Add `-p npm` to line 181 (Template variables test)
- [ ] Add `-p npm` to line 220 (Non-empty directory test)
- [ ] Verify no syntax errors in test file

## Success Criteria

- ✅ All 8 `execSync` calls include `-p npm` flag
- ✅ Test file syntax is valid
- ✅ Flag positioned consistently (after `--use-case`, before `--skip-install`)
- ✅ No changes to test logic, only command flags

## Verification Steps

1. Apply all changes to `cli.e2e.test.mjs`
2. Run syntax check: `node packages/cli/tests/integration/cli.e2e.test.mjs`
3. Verify all 8 locations have `-p npm` flag
4. Proceed to Phase 2 or run full E2E test suite

## Risk Assessment

**Risk**: None
**Breaking Changes**: None (test-only changes)

## Security Considerations

None - test environment only.

## Next Steps

After completion:
- Proceed to [Phase 2: Auto-detect Package Manager](./phase-02-auto-detect-pm.md)
- Or run E2E tests immediately to verify fix
