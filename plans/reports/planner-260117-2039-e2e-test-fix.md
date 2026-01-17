# E2E Test Fix Implementation Plan

**Date**: 2026-01-17 20:39
**Status**: ✅ COMPLETE
**Plan Location**: d:\Sui\walrus-starter-kit\plans\260117-2039-e2e-test-fix\

## Executive Summary

Created comprehensive 4-phase implementation plan to fix E2E test failures caused by missing package manager flag triggering silent exit in non-interactive mode.

## Root Cause (Verified)

E2E tests miss `-p npm` flag → CLI shows interactive prompt → non-interactive env triggers onCancel → process.exit(0) → no files created → tests fail

## Solution Approach

**3-layer robust fix**:
1. **Immediate** (Phase 1): Add `-p npm` to E2E tests → fixes all 8 failing tests
2. **Better UX** (Phase 2): Auto-detect PM in non-interactive mode → works in CI/CD without flag
3. **Better DX** (Phase 3): Improve error messages + exit code 1 → clear debugging

## Plan Structure

```
plans/260117-2039-e2e-test-fix/
├── plan.md                           # Overview, status, phase links
├── phase-01-fix-e2e-tests.md         # Add -p npm (10m, 8 locations)
├── phase-02-auto-detect-pm.md        # TTY check + auto-detect (20m)
├── phase-03-improve-error-handling.md # Exit code 1 + stderr (15m)
└── phase-04-verification.md          # Test matrix, manual validation (15m)
```

**Total Effort**: ~1 hour

## Key Deliverables

### Phase 1: Fix E2E Tests
- Add `-p npm` to 8 execSync calls in cli.e2e.test.mjs
- Lines: 60, 80, 95, 116, 142, 161, 181, 220
- **Impact**: All 11 tests pass immediately

### Phase 2: Auto-detect Package Manager
- Add `isInteractive()` helper checking `process.stdin.isTTY`
- Auto-fill `initial.packageManager` when no TTY
- Log detection: "📦 Non-interactive mode: using detected package manager \"npm\""
- **Impact**: CLI works in CI/CD without `-p` flag

### Phase 3: Improve Error Handling
- Change onCancel exit code: `exit(0)` → `exit(1)`
- Use stderr: `console.log` → `console.error`
- Add helpful hint with example command
- **Impact**: CI/CD detects failures, clear debugging

### Phase 4: Verification
- E2E suite (11 tests)
- Interactive mode manual test
- Non-interactive auto-detect test
- Error handling validation
- CI/CD simulation
- **Success**: All tests green, no regressions

## Files Modified

| File | Changes | Phase |
|------|---------|-------|
| cli.e2e.test.mjs | Add `-p npm` to 8 execSync calls | 1 |
| prompts.ts | Add isInteractive(), auto-detect PM | 2 |
| prompts.ts | Update onCancel handler (exit 1, stderr) | 3 |

## Success Criteria

- ✅ All 11 E2E tests pass (currently 3/11)
- ✅ CLI works in CI/CD without `-p` flag
- ✅ Error exit code 1 (not 0)
- ✅ Clear error messages with hints
- ✅ No breaking changes to CLI interface

## Test Matrix

| Scenario | Mode | PM Flag | Expected |
|----------|------|---------|----------|
| E2E Suite | Non-interactive | Yes | All 11 pass ✅ |
| Interactive | TTY | No | Shows prompt ✅ |
| Auto-detect | No TTY | No | Detects PM ✅ |
| Explicit Flag | No TTY | Yes | Uses flag ✅ |
| Cancel | TTY | N/A | Exit code 1 ✅ |
| Invalid SDK | Any | Yes | Exit code 1 ✅ |

## Implementation Steps (Summary)

**Phase 1** (10m):
1. Add `-p npm` after `--use-case` in 8 locations
2. Verify syntax, no logic changes

**Phase 2** (20m):
1. Add `isInteractive()` helper (check TTY)
2. Auto-fill PM when `!isInteractive() && !initial.packageManager`
3. Log choice for transparency
4. Add JSDoc comments

**Phase 3** (15m):
1. Update onCancel: `console.error`, `exit(1)`, add hint
2. Update secondary exit: same changes
3. Verify stderr output

**Phase 4** (15m):
1. Build CLI (`pnpm build`)
2. Run E2E suite (expect 11/11 pass)
3. Manual tests (interactive, non-interactive, errors)
4. Regression checks

## Risk Assessment

**Risk**: Low
- Phase 1: Test-only changes (no CLI code modified)
- Phase 2: Additive (preserves existing prompt behavior)
- Phase 3: Correctness fix (exit 0 → 1 is proper behavior)

**Mitigation**:
- Test both interactive and non-interactive modes
- Verify explicit flags override auto-detection
- Check CI/CD compatibility

## Technical Details

### Root Cause Chain
1. E2E test: `execSync(node dist/index.js test-project --sdk mysten ...)`
2. Missing: `-p` flag
3. CLI: Reaches package manager prompt (prompts.ts:92-106)
4. execSync: No stdin in non-interactive mode
5. Prompts library: Detects no TTY → calls onCancel
6. Handler: `process.exit(0)` (success code)
7. execSync: Returns normally (no error)
8. Test: Expects project directory → finds nothing → fails

### Fix 1 Mechanism
- Add `-p npm` → Initial context has packageManager
- Prompt logic: `type: initial.packageManager ? null : 'select'`
- Type null → prompt skipped
- No prompt → no cancellation → generation succeeds

### Fix 2 Mechanism
- Check `process.stdin.isTTY` before prompts
- If false + no PM provided → detect via `npm_config_user_agent`
- Set `initial.packageManager` = detected value
- Prompt skipped (same as Fix 1)
- Benefit: Works without flag in CI/CD

### Fix 3 Mechanism
- Exit code 1 → Shell scripts detect failure
- stderr → CI/CD separates logs from errors
- Helpful hint → Users know solution
- No logic changes → Only messaging

## Code Snippets

**Phase 1 Example**:
```javascript
// Before
`node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload --skip-install --skip-git`

// After
`node "${CLI_BIN}" ${projectName} --sdk mysten --framework react --use-case simple-upload -p npm --skip-install --skip-git`
```

**Phase 2 Key Code**:
```typescript
function isInteractive(): boolean {
  return process.stdin.isTTY === true;
}

export async function runPrompts(initial: Partial<Context> = {}): Promise<Partial<Context>> {
  if (!isInteractive() && !initial.packageManager) {
    const detected = detectPackageManager();
    console.log(`📦 Non-interactive mode: using detected package manager "${detected}"`);
    initial.packageManager = detected;
  }
  // ... rest of prompts
}
```

**Phase 3 Key Code**:
```typescript
{
  onCancel: () => {
    console.error('\n❌ Operation cancelled.');
    console.error('💡 Hint: In non-interactive environments (CI/CD), use -p flag to specify package manager.');
    console.error('   Example: create-walrus-app my-app -p npm');
    process.exit(1); // Changed from 0
  },
}
```

## Verification Commands

**E2E Suite**:
```bash
node packages/cli/tests/integration/cli.e2e.test.mjs
# Expected: 11 passed, 0 failed
```

**Interactive Test**:
```bash
node packages/cli/dist/index.js test-interactive
# Should show PM prompt
```

**Non-Interactive Test**:
```bash
echo "" | node packages/cli/dist/index.js test-non-interactive --sdk mysten --framework react --use-case simple-upload --skip-install --skip-git
# Should log: "📦 Non-interactive mode: using detected package manager \"npm\""
```

**Error Handling**:
```bash
node packages/cli/dist/index.js test-cancel
# Press Ctrl+C → should show error with exit code 1
```

## Dependencies

**None** - All changes use existing code:
- `detectPackageManager()` already exists (detect-pm.ts)
- `process.stdin.isTTY` is Node.js built-in
- No new npm packages required

## Breaking Changes

**None** - All changes are backward compatible:
- Existing flags still work
- Interactive mode unchanged (when TTY available)
- Non-interactive auto-detection is additive feature
- Error code fix corrects existing bug

## Performance Impact

**Negligible**:
- TTY check: O(1), single property access
- PM detection: O(1), env variable lookup
- No file I/O or network calls added

## Documentation Updates

**Recommended** (not in plan, future task):
- Update README with `-p` flag usage
- Document non-interactive mode behavior
- Add CI/CD integration examples
- Update troubleshooting guide

## Related Work

**Reports Analyzed**:
- tester-260117-2024-e2e-test-compilation-and-execution.md
- debugger-260117-2031-e2e-test-root-cause-analysis.md

**Previous Attempts**:
- None - Root cause newly identified

## Unresolved Questions

None - All fixes deterministic and verified through:
- Manual testing (debugger report shows working commands)
- Code analysis (exact trigger points identified)
- Clear reproduction steps (execSync without -p flag)

## Next Actions

1. Assign to implementation agent (coder/developer)
2. Execute Phase 1 → verify E2E tests pass
3. Execute Phases 2-3 → verify non-interactive works
4. Execute Phase 4 → full validation
5. Create git commit with conventional format
6. Submit PR with test results

## Estimated Timeline

- **Immediate Relief**: 10 minutes (Phase 1 only)
- **Complete Solution**: 1 hour (all phases)
- **Verification**: 15 minutes (Phase 4)
- **Total**: ~1.25 hours end-to-end

## Priority Justification

**P1 (High)**:
- Blocks E2E test suite (8/11 tests failing)
- Affects CI/CD reliability
- Silent failures hard to debug
- Quick fix available (Phase 1)

## Confidence Level

**High (95%)**:
- Root cause verified through manual testing
- Fix 1 proven to work (debugger manual test passed with `-p npm`)
- Fix 2 uses existing detection logic
- Fix 3 is simple error handling improvement
- No edge cases identified
- Clear success criteria
