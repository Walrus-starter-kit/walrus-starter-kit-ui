---
title: "Fix E2E Test Failures - Package Manager Prompt Issue"
description: "Fix E2E tests failing due to missing package manager flag causing silent exit in non-interactive mode"
status: pending
priority: P1
effort: 1h
branch: main
tags: [testing, e2e, bug-fix, cli]
created: 2026-01-17
---

# E2E Test Fix Implementation Plan

## Context

**Root Cause**: E2E tests fail because CLI exits silently (exit code 0) when package manager prompt is cancelled in non-interactive environment. Tests use `execSync` without stdin, causing prompts library to call `onCancel` handler which exits gracefully, leaving no project files created.

**Related Reports**:
- [d:\Sui\walrus-starter-kit\plans\reports\tester-260117-2024-e2e-test-compilation-and-execution.md](../reports/tester-260117-2024-e2e-test-compilation-and-execution.md)
- [d:\Sui\walrus-starter-kit\plans\reports\debugger-260117-2031-e2e-test-root-cause-analysis.md](../reports/debugger-260117-2031-e2e-test-root-cause-analysis.md)

## Overview

Implement 3-layer fix for robust solution:
1. **Immediate**: Add `-p npm` flag to E2E tests (fixes all 8 failing tests)
2. **Better UX**: Auto-detect package manager in non-interactive mode
3. **Better DX**: Improve error handling and messages

## Current Status

- **8/11 tests failing** - all generation tests fail due to missing `-p` flag
- **3/11 tests passing** - help, validation tests work
- Root cause verified through manual testing and code analysis

## Implementation Phases

| Phase | Description | Files | Effort |
|-------|-------------|-------|--------|
| 1 | Add `-p npm` to E2E tests | cli.e2e.test.mjs | 10m |
| 2 | Auto-detect PM in non-interactive mode | prompts.ts | 20m |
| 3 | Improve error handling | prompts.ts | 15m |
| 4 | Run tests & verify | - | 15m |

**Total Effort**: ~1 hour

## Files to Modify

- `packages/cli/tests/integration/cli.e2e.test.mjs` - Add `-p npm` flag to all execSync calls
- `packages/cli/src/prompts.ts` - Detect non-interactive mode, auto-fill PM, improve error handling

## Success Criteria

- ✅ All 11 E2E tests pass
- ✅ CLI works in CI/CD without `-p` flag (auto-detect)
- ✅ Clear error messages when prompt is cancelled
- ✅ "Non-empty directory" test fails correctly (not false positive)
- ✅ No breaking changes to CLI interface

## Phase Links

- [Phase 1: Fix E2E Tests (Immediate)](./phase-01-fix-e2e-tests.md) - Add `-p npm` flag
- [Phase 2: Auto-detect Package Manager](./phase-02-auto-detect-pm.md) - Non-interactive mode handling
- [Phase 3: Improve Error Handling](./phase-03-improve-error-handling.md) - Better DX
- [Phase 4: Verification & Testing](./phase-04-verification.md) - Run tests, validate fixes

## Risk Assessment

**Low Risk**:
- Fix 1 is non-invasive (only test file changes)
- Fix 2 preserves existing behavior (only adds auto-detect for non-interactive)
- Fix 3 improves error clarity (no logic changes)

**Mitigation**:
- Test manually after each phase
- Verify interactive mode still works
- Check CI/CD compatibility

## Next Steps

1. Implement Phase 1 (immediate fix)
2. Run E2E tests to verify all pass
3. Implement Phase 2 (better UX)
4. Implement Phase 3 (better DX)
5. Final verification
