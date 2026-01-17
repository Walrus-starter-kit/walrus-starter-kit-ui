# Phase 4: Verification & Testing

## Overview

**Priority**: P1 (HIGH)
**Effort**: 15 minutes
**Status**: Pending

Comprehensive testing to verify all three fixes work correctly together and no regressions introduced.

## Context Links

- Main Plan: [plan.md](./plan.md)
- Previous Phases:
  - [Phase 1: Fix E2E Tests](./phase-01-fix-e2e-tests.md)
  - [Phase 2: Auto-detect Package Manager](./phase-02-auto-detect-pm.md)
  - [Phase 3: Improve Error Handling](./phase-03-improve-error-handling.md)

## Key Insights

- All three fixes must work together without conflicts
- Need to test both interactive and non-interactive modes
- E2E tests are primary success indicator
- Manual verification ensures real-world usability

## Requirements

### Functional
- All 11 E2E tests pass (8 generation + 3 validation tests)
- Interactive mode still shows prompts
- Non-interactive mode auto-detects package manager
- Error messages are clear and helpful
- Exit codes are correct (0 for success, 1 for errors)

### Non-functional
- Tests complete in reasonable time (< 2 minutes)
- No breaking changes to CLI interface
- Clear test output for debugging

## Test Strategy

### Level 1: Unit-Level Verification (5 minutes)
Verify individual changes compile and run

### Level 2: E2E Test Suite (5 minutes)
Run full automated test suite

### Level 3: Manual Validation (5 minutes)
Real-world usage scenarios

## Verification Steps

### Step 1: Build CLI

**Command**:
```bash
cd packages/cli
pnpm build
```

**Expected Output**:
```
> @walrus-kit/create-walrus-app@x.x.x build
> tsc

✓ Build completed successfully
```

**Success Criteria**:
- No TypeScript errors
- `dist/` directory created
- `dist/index.js` exists

---

### Step 2: Run E2E Test Suite

**Command**:
```bash
node packages/cli/tests/integration/cli.e2e.test.mjs
```

**Expected Output**:
```
🧪 Running E2E Tests...

✓ CLI binary exists
✓ CLI shows help with --help flag
✓ Creates React project with all flags
✓ Package.json has correct name
✓ Package.json includes React dependencies
✓ Creates simple-upload use-case correctly
✓ Creates gallery use-case correctly
✓ Includes required configuration files
✓ Replaces template variables correctly
✓ Fails for invalid SDK
✓ Fails for non-empty directory

📊 Results: 11 passed, 0 failed
```

**Success Criteria**:
- All 11 tests pass
- No ENOENT errors (files created correctly)
- "Non-empty directory" test fails as expected (not false positive)
- Tests complete in < 2 minutes

**If Tests Fail**:
1. Check error messages (should be clear and helpful)
2. Verify `-p npm` flag in all execSync calls
3. Verify CLI compiles correctly
4. Check temp directory permissions

---

### Step 3: Verify Interactive Mode (Manual)

**Command**:
```bash
cd packages/cli
node dist/index.js test-interactive-project
```

**User Actions**:
1. Enter project name (or press Enter for default)
2. Select SDK (mysten)
3. Select framework (React)
4. Select use case (simple-upload)
5. Select analytics (No)
6. Select Tailwind (Yes)
7. **SELECT PACKAGE MANAGER** (should show prompt)

**Expected Behavior**:
- All prompts appear including package manager selection
- Project created successfully after selections
- No auto-detection message shown (interactive mode)

**Success Criteria**:
- ✅ Package manager prompt shown
- ✅ User can select npm/pnpm/yarn/bun
- ✅ Project created in current directory
- ✅ No Phase 2 auto-detection triggered (TTY available)

---

### Step 4: Verify Non-Interactive Mode (Auto-detect)

**Command**:
```bash
cd packages/cli
echo "" | node dist/index.js test-non-interactive --sdk mysten --framework react --use-case simple-upload --skip-install --skip-git
```

**Expected Output**:
```
📦 Non-interactive mode: using detected package manager "npm"
✨ Creating Walrus app in test-non-interactive...
✓ Project generated successfully!
```

**Success Criteria**:
- ✅ Auto-detection message logged
- ✅ No package manager prompt shown
- ✅ Project created successfully
- ✅ Exit code 0

**Cleanup**:
```bash
rm -rf packages/cli/test-non-interactive
```

---

### Step 5: Verify Non-Interactive with Explicit Flag

**Command**:
```bash
cd packages/cli
echo "" | node dist/index.js test-explicit-pm --sdk mysten --framework react --use-case simple-upload -p pnpm --skip-install --skip-git
```

**Expected Output**:
```
✨ Creating Walrus app in test-explicit-pm...
✓ Project generated successfully!
```

**Success Criteria**:
- ✅ No auto-detection message (flag provided)
- ✅ Uses `pnpm` from flag (check package.json scripts if needed)
- ✅ Project created successfully

**Cleanup**:
```bash
rm -rf packages/cli/test-explicit-pm
```

---

### Step 6: Verify Error Handling

**Test 6.1: User Cancellation (Interactive)**

**Command**:
```bash
cd packages/cli
node dist/index.js test-cancel
# Press Ctrl+C or ESC when first prompt appears
echo "Exit code: $?"
```

**Expected Output** (stderr):
```
❌ Operation cancelled.
💡 Hint: In non-interactive environments (CI/CD), use -p flag to specify package manager.
   Example: create-walrus-app my-app -p npm
Exit code: 1
```

**Success Criteria**:
- ✅ Exit code is 1 (not 0)
- ✅ Error appears in stderr
- ✅ Helpful hint message shown

---

**Test 6.2: Invalid SDK**

**Command**:
```bash
cd packages/cli
node dist/index.js test-invalid --sdk fake-sdk --framework react -p npm
echo "Exit code: $?"
```

**Expected**:
- Error message about invalid SDK
- Exit code: 1
- No project directory created

---

**Test 6.3: Non-Empty Directory**

**Command**:
```bash
cd packages/cli
mkdir test-non-empty
echo "existing content" > test-non-empty/file.txt
node dist/index.js test-non-empty --sdk mysten --framework react --use-case simple-upload -p npm
echo "Exit code: $?"
rm -rf test-non-empty
```

**Expected**:
- Error about directory not empty
- Exit code: 1
- No new files created

---

### Step 7: CI/CD Simulation

**Test GitHub Actions Environment**

**Command**:
```bash
cd packages/cli
CI=true npm_config_user_agent="npm/9.0.0" node dist/index.js test-ci-simulation --sdk mysten --framework react --use-case simple-upload --skip-install --skip-git
echo "Exit code: $?"
rm -rf test-ci-simulation
```

**Expected**:
- Auto-detects npm (from user agent)
- Project created successfully
- Exit code: 0
- No prompts shown

---

### Step 8: Integration Test (if exists)

**Command**:
```bash
pnpm --filter @walrus-kit/create-walrus-app test
```

**Expected**:
- All tests pass (if integration tests exist)
- Or skip if only E2E tests available

---

### Step 9: Regression Check - Basic Functionality

**Quick Smoke Test**:
```bash
cd packages/cli
node dist/index.js test-smoke-react --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --skip-git
cd test-smoke-react
ls -la src/components/UploadForm.tsx
cat package.json | grep '"name"'
cd ..
rm -rf test-smoke-react
```

**Success Criteria**:
- ✅ Project created
- ✅ UploadForm.tsx exists
- ✅ package.json has correct name
- ✅ No template variables ({{...}}) in files

## Test Matrix

| Test | Mode | PM Flag | Expected Result |
|------|------|---------|-----------------|
| E2E Suite | Non-interactive | Yes (`-p npm`) | All 11 pass ✅ |
| Interactive | Interactive | No | Shows PM prompt ✅ |
| Auto-detect | Non-interactive | No | Auto-detects PM ✅ |
| Explicit Flag | Non-interactive | Yes (`-p pnpm`) | Uses pnpm ✅ |
| User Cancel | Interactive | N/A | Exit code 1 ✅ |
| Invalid SDK | Any | Yes | Exit code 1 ✅ |
| Non-empty Dir | Any | Yes | Exit code 1 ✅ |
| CI Simulation | Non-interactive | No | Auto-detects ✅ |

## Todo List

- [ ] Build CLI with TypeScript compiler
- [ ] Run E2E test suite (all 11 tests)
- [ ] Verify interactive mode shows PM prompt
- [ ] Verify non-interactive mode auto-detects
- [ ] Test explicit PM flag override
- [ ] Test user cancellation (exit code 1)
- [ ] Test invalid SDK error handling
- [ ] Test non-empty directory error
- [ ] Test CI/CD simulation
- [ ] Run regression smoke tests
- [ ] Verify no template variables in output
- [ ] Check exit codes are correct

## Success Criteria

### Must Pass (Blocking)
- ✅ All 11 E2E tests pass
- ✅ No TypeScript compilation errors
- ✅ Interactive mode shows prompts
- ✅ Non-interactive mode auto-detects
- ✅ Exit code 1 for errors (not 0)

### Should Pass (Important)
- ✅ Error messages are helpful
- ✅ No file creation for cancelled operations
- ✅ CI/CD simulation works
- ✅ Explicit flags override auto-detection

### Nice to Have
- ✅ Tests complete quickly (< 2 min)
- ✅ Clear error messages
- ✅ Consistent behavior across platforms

## Regression Checks

Verify no breaking changes:
- [ ] Existing CLI flags still work (`--help`, `--version`, etc.)
- [ ] Project structure unchanged (same files created)
- [ ] Template variable replacement works
- [ ] Package.json merging correct
- [ ] Git initialization works (when not skipped)
- [ ] Install process works (when not skipped)

## Troubleshooting Guide

### If E2E Tests Fail

**Symptom**: "Project directory not created"
- **Check**: Verify `-p npm` flag in test command (Phase 1)
- **Fix**: Add missing flag to execSync call

**Symptom**: "ENOENT: package.json not found"
- **Check**: Build completed successfully
- **Fix**: Run `pnpm build` in packages/cli

**Symptom**: "Template variable not replaced"
- **Check**: Template transformation logic
- **Fix**: Verify `transform.ts` not modified

---

### If Interactive Mode Fails

**Symptom**: No prompts shown
- **Check**: `process.stdin.isTTY` is true
- **Fix**: Run in actual terminal (not piped)

**Symptom**: Auto-detection triggers incorrectly
- **Check**: TTY detection logic in Phase 2
- **Fix**: Verify `isInteractive()` function

---

### If Non-Interactive Fails

**Symptom**: Prompt shown instead of auto-detect
- **Check**: stdin is not TTY
- **Fix**: Pipe empty string: `echo "" | node ...`

**Symptom**: Wrong package manager detected
- **Check**: `npm_config_user_agent` env variable
- **Fix**: Set correct env: `npm_config_user_agent="pnpm/8.0.0"`

---

### If Error Handling Fails

**Symptom**: Exit code 0 instead of 1
- **Check**: Phase 3 changes applied
- **Fix**: Update `onCancel` handler to use `exit(1)`

**Symptom**: Errors in stdout instead of stderr
- **Check**: `console.error` used (not `console.log`)
- **Fix**: Change to `console.error`

## Performance Benchmarks

Expected test execution times:
- E2E Suite: 30-90 seconds (11 tests, file generation)
- Single Test: 3-8 seconds (project creation)
- Interactive Mode: Instant (prompts load)
- Auto-detect: < 1 second (environment check)

If tests take > 2 minutes, investigate:
- Temp directory cleanup issues
- File system performance
- Multiple concurrent runs

## Final Checklist

Before marking phase complete:
- [ ] All E2E tests green (11/11 passed)
- [ ] Manual interactive test successful
- [ ] Manual non-interactive test successful
- [ ] Error handling verified (exit codes)
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Clean git status (no unintended changes)
- [ ] Documentation accurate (if updated)

## Next Steps

After verification passes:
1. Create git commit with all changes
2. Update project documentation (README, changelog)
3. Submit PR with test results
4. Deploy to staging/production
5. Monitor CI/CD pipelines for issues

## Unresolved Questions

None - all fixes are deterministic and testable.
