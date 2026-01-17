---
phase: 05
title: Testing
status: completed
priority: P1
effort: 0.5h
completed: 2026-01-18
---

# Phase 05: Testing

## Context

- [Phase 04: Swap Logic](./phase-04-implement-swap-logic.md)

## Overview

Comprehensive testing of all swap functionality across different scenarios.

## Test Cases

### 1. Dependency Loading

| Test | Expected | Pass |
|------|----------|------|
| Page loads without console errors | No import errors | [ ] |
| getWallets() returns array | Array (may be empty) | [ ] |
| SuiClient initializes | Object in console | [ ] |

### 2. Wallet Connection

| Test | Expected | Pass |
|------|----------|------|
| No wallet: show install message | "Install wallet" or empty state | [ ] |
| Click connect: wallet popup | Wallet extension opens | [ ] |
| Approve connection: address shows | Truncated address visible | [ ] |
| Disconnect: clears state | Connect button returns | [ ] |
| Reconnect: works again | Same flow succeeds | [ ] |

### 3. Swap UI

| Test | Expected | Pass |
|------|----------|------|
| Disconnected: balance shows "--" | "--" displayed | [ ] |
| Connected: balance shows SUI | X.XXXX SUI format | [ ] |
| Enter 0: button disabled | "Enter Amount" | [ ] |
| Enter > balance: warning | "Insufficient balance" | [ ] |
| Enter valid: button enabled | "Swap to WAL" | [ ] |
| MAX click: sets balance - 0.05 | Correct calculation | [ ] |
| MAX with low balance: handles edge | No negative values | [ ] |

### 4. Swap Execution

| Test | Expected | Pass |
|------|----------|------|
| Click swap: loading state | "Processing...", disabled | [ ] |
| Wallet popup appears | Transaction details shown | [ ] |
| User rejects: error toast | "Rejected" or similar | [ ] |
| User approves: success toast | "Swap Successful" | [ ] |
| Success: balance refreshes | New balance shown | [ ] |
| Success: input clears | Empty input field | [ ] |
| Explorer link works | Opens Suiscan | [ ] |

### 5. Edge Cases

| Test | Expected | Pass |
|------|----------|------|
| Very small amount (0.0001) | Transaction succeeds | [ ] |
| Amount with many decimals | Truncates correctly | [ ] |
| Network error during swap | Error handled gracefully | [ ] |
| Switch wallet mid-session | Handles reconnection | [ ] |

### 6. Browser Compatibility

| Browser | Connect | Swap | Pass |
|---------|---------|------|------|
| Chrome | [ ] | [ ] | [ ] |
| Firefox | [ ] | [ ] | [ ] |
| Safari | [ ] | [ ] | [ ] |
| Edge | [ ] | [ ] | [ ] |

## Testing Steps

1. **Local server setup**
   ```bash
   # From project root
   npx serve .
   # or
   python -m http.server 8080
   ```

2. **Install Sui Wallet extension**
   - Chrome: Sui Wallet or Slush from Chrome Web Store
   - Ensure testnet network selected
   - Have testnet SUI for testing (use faucet)

3. **Run through each test case**
   - Document any failures
   - Capture console errors

## Faucet

Get testnet SUI: https://suifaucet.com/ or Discord bot

## Known Issues to Check

1. **Import map support** - Safari 16.4+, Chrome 89+, Firefox 108+
2. **ES modules in older browsers** - May need polyfill
3. **Wallet popup blockers** - User may need to allow popups

## Todo

- [ ] Set up local server
- [ ] Install wallet extension with testnet SUI
- [ ] Run all test cases
- [ ] Document any failures
- [ ] Fix identified issues

## Success Criteria

All test cases pass across Chrome and at least one other browser.

## Post-Testing

- Document any known limitations in README or plan
- Create issues for any non-blocking bugs
- Plan phase for fixes if critical issues found
