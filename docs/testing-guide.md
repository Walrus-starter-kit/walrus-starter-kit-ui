# Testing Guide - Swap Feature

## Prerequisites

### Required Tools
- Modern browser (Chrome, Firefox, Edge)
- Sui Wallet browser extension
- Testnet SUI tokens (from faucet)

### Setup Steps

**1. Install Sui Wallet**
- Visit Chrome Web Store
- Search "Sui Wallet"
- Install official extension
- Create/import wallet

**2. Get Testnet SUI**
- Open Sui Wallet
- Switch to Testnet network
- Click "Request SUI"
- Or use faucet: `https://discord.gg/sui` → #testnet-faucet channel

**3. Verify Balance**
- Ensure > 0.1 SUI for testing swaps
- Reserve 0.05 SUI minimum for gas

## Manual Test Suite

### Test 1: Wallet Connection

**Steps:**
1. Open `index.html` in browser
2. Click "Connect Wallet" in navbar
3. Approve connection in wallet popup

**Expected Results:**
- ✓ Button changes to wallet info panel
- ✓ Address displayed as `0x1234...abcd` format
- ✓ "Disconnect" button visible
- ✓ Swap section shows balance (e.g., "1.2345 SUI")
- ✓ Swap button enabled if balance > 0

**Failure Cases:**
- No wallet installed → Alert: "No Sui wallet found..."
- User rejects → Alert: "Failed to connect: User rejected..."
- Multiple clicks → Only one connection attempt

---

### Test 2: Disconnect Wallet

**Steps:**
1. With wallet connected
2. Click "Disconnect" button

**Expected Results:**
- ✓ Wallet info panel hidden
- ✓ "Connect Wallet" button reappears
- ✓ Swap balance shows `--`
- ✓ Swap button disabled with text "Connect Wallet to Swap"

---

### Test 3: Input Validation - Valid Amount

**Steps:**
1. Connect wallet
2. Enter `0.5` in swap input
3. Observe swap button

**Expected Results:**
- ✓ No error messages visible
- ✓ Swap button enabled
- ✓ Button text: "Swap to WAL"

---

### Test 4: Input Validation - Insufficient Balance

**Setup:** Wallet has 1.0 SUI

**Steps:**
1. Enter `1.5` in swap input

**Expected Results:**
- ✓ Red error message: "⚠️ Insufficient balance"
- ✓ Swap button disabled
- ✓ Button text: "Insufficient Balance"

---

### Test 5: Input Validation - Zero/Negative

**Steps:**
1. Enter `0`
2. Then enter `-5`

**Expected Results:**
- ✓ Button disabled for both
- ✓ Button text: "Enter Amount"
- ✓ No error message (just disabled state)

---

### Test 6: MAX Button

**Setup:** Wallet has 1.0 SUI

**Steps:**
1. Click "MAX" button

**Expected Results:**
- ✓ Input field shows `0.9500` (1.0 - 0.05 gas reserve)
- ✓ Swap button enabled
- ✓ No insufficient balance error

**Edge Case:** Wallet has 0.03 SUI
- ✓ Input shows `0.0000` (can't fill if below gas reserve)

---

### Test 7: Successful Swap

**Setup:** Wallet has ≥ 0.2 SUI

**Steps:**
1. Enter `0.1` SUI
2. Click "Swap to WAL"
3. Approve transaction in wallet popup
4. Wait for confirmation

**Expected Results:**
- ✓ Button shows "Processing..." with pulse animation
- ✓ Green toast appears: "Swap Successful!"
- ✓ Toast contains "View on Explorer" link
- ✓ Balance updates (decreased by ~0.1 + gas)
- ✓ Input field clears
- ✓ Toast auto-dismisses after 5s

**Verification:**
- Open SuiScan link from toast
- Confirm transaction status: Success
- Check wallet for WAL tokens (may need to add token)

---

### Test 8: Failed Swap - User Rejection

**Steps:**
1. Enter valid amount
2. Click "Swap to WAL"
3. **Reject** transaction in wallet popup

**Expected Results:**
- ✓ Red toast: "Swap Failed"
- ✓ Error message in toast (e.g., "User rejected")
- ✓ Balance unchanged
- ✓ Button restores to "Swap to WAL"
- ✓ Input value preserved

---

### Test 9: Invalid Input Formats

**Test Cases:**
| Input | Expected Behavior |
|-------|------------------|
| `abc` | Browser prevents (number input) |
| `1e-5` | Alert: "Please enter a valid amount (e.g., 1.5)" |
| `1.23.45` | Browser prevents (invalid decimal) |
| `-1` | Disabled button (validation catches) |
| ` ` (spaces) | Treated as 0, button disabled |

---

### Test 10: Network Error Handling

**Simulation:**
1. Disconnect internet
2. Try to connect wallet (will fail on balance fetch)
3. Reconnect internet
4. Observe console logs

**Expected Results:**
- ✓ Console shows "Failed to fetch balance: [error]"
- ✓ UI shows balance as `--`
- ✓ No app crash, graceful degradation

---

### Test 11: Rapid Interactions

**Steps:**
1. Click "Connect Wallet" 10 times rapidly
2. Click "Swap to WAL" multiple times during processing

**Expected Results:**
- ✓ Only one connection attempt (debounce flag)
- ✓ Only one swap transaction (button disabled during processing)
- ✓ No duplicate transactions

---

### Test 12: Page Reload Persistence

**Steps:**
1. Connect wallet
2. Reload page (F5)

**Expected Results:**
- ✓ Wallet disconnected (no auto-reconnect)
- ✓ UI back to initial state
- ✓ No errors in console

**Note:** By design, does not persist connection (security best practice)

---

## Automated Testing (Future Implementation)

### Unit Tests (Jest/Vitest)

```javascript
// Example test structure (not yet implemented)

describe('WalletManager', () => {
  test('getSuiWallets filters correctly', () => {
    // Mock wallet-standard
    // Verify only Sui-compatible wallets returned
  });

  test('connect throws if no wallet', async () => {
    // Mock empty wallet list
    // Expect error thrown
  });

  test('getAddressShort truncates correctly', () => {
    // Set mock address
    // Verify format: 0x1234...abcd
  });
});

describe('buildSwapTransaction', () => {
  test('converts SUI to MIST correctly', async () => {
    const tx = await buildSwapTransaction(1.5);
    // Verify amount: 1.5 * 1_000_000_000 = 1_500_000_000
  });

  test('rejects negative amounts', async () => {
    await expect(buildSwapTransaction(-1)).rejects.toThrow();
  });
});

describe('escapeHtml', () => {
  test('escapes XSS vectors', () => {
    const input = '<script>alert("xss")</script>';
    const output = escapeHtml(input);
    expect(output).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
  });
});
```

### Integration Tests (Playwright/Cypress)

```javascript
// Example E2E test structure (not yet implemented)

test('complete swap flow', async ({ page }) => {
  // Navigate to page
  await page.goto('http://localhost:3000');

  // Connect wallet (requires wallet mock)
  await page.click('#connect-wallet-btn');

  // Enter amount
  await page.fill('#swap-amount', '0.1');

  // Execute swap
  await page.click('#swap-btn');

  // Wait for toast
  await page.waitForSelector('.bg-green-500', { timeout: 30000 });

  // Verify success message
  const toast = await page.textContent('.bg-green-500');
  expect(toast).toContain('Swap Successful');
});
```

## Browser Compatibility

| Browser | Tested | Notes |
|---------|--------|-------|
| Chrome 120+ | ✓ | Primary development browser |
| Firefox 121+ | ✓ | Wallet Standard support confirmed |
| Edge 120+ | ✓ | Chromium-based, works identically |
| Safari 17+ | ⚠️ | Wallet extension availability limited |
| Mobile browsers | ❌ | Not tested, wallet extensions unsupported |

## Console Debugging Commands

Open browser DevTools console and try:

```javascript
// Check wallet detection
walletManager.getSuiWallets()

// Check connection status
walletManager.connected

// Get current balance
walletManager.balance

// Get full address
walletManager.getAddress()

// Manually refresh balance
await walletManager.refreshBalance()
```

## Known Issues

### Issue: Transaction Fails with "Insufficient gas"
**Cause:** Gas estimation varies, 0.05 reserve may be too low for congested network
**Workaround:** Increase `gasReserve` in `handleMaxClick()` to 0.1

### Issue: Balance shows stale data
**Cause:** RPC cache or slow propagation
**Workaround:** Manually call `walletManager.refreshBalance()`

### Issue: Explorer link 404
**Cause:** Transaction still pending/indexing
**Workaround:** Wait 10-15 seconds, refresh SuiScan page

## Test Coverage Metrics (Target)

- [ ] Unit tests: 80% code coverage
- [ ] Integration tests: All user flows covered
- [ ] Manual tests: All 12 scenarios pass
- [ ] Browser tests: 3/4 major browsers
- [ ] Error scenarios: 100% handled gracefully

## Reporting Bugs

When filing issues, include:
- Browser version
- Wallet extension version
- Console errors (screenshot or copy)
- Network (testnet/mainnet)
- Steps to reproduce
- Expected vs actual behavior
