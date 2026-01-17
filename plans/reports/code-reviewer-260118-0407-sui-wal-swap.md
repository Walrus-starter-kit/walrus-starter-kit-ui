# Code Review: SUI to WAL Swap Integration

**Score: 7.5/10**

## Scope
- Files reviewed: `index.html` (lines 131-139, 168-181, 285-349, 776-777), `swap.js` (382 lines)
- Lines analyzed: ~450
- Focus: New swap feature integration

## Overall Assessment
Solid implementation with proper wallet integration patterns. Good separation of concerns with WalletManager class. Some security and UX improvements needed. Code follows KISS principle reasonably well.

---

## Critical Issues (MUST FIX)

### 1. XSS Vulnerability in Success Toast (HIGH)
**File:** `swap.js` line 292-294
```javascript
`<a href="https://suiscan.xyz/testnet/tx/${digest}" ...>`
```
**Problem:** Transaction digest inserted directly into HTML without sanitization. Malicious wallet could inject script via digest.
**Fix:** Validate digest format (hex string) before insertion:
```javascript
const isValidDigest = /^[A-Za-z0-9+/=]{40,50}$/.test(digest);
if (!isValidDigest) throw new Error('Invalid digest format');
```

### 2. No Input Sanitization on Amount
**File:** `swap.js` line 223
```javascript
const amount = parseFloat(elements.swapAmount?.value) || 0;
```
**Problem:** HTML input `type="number"` can be bypassed. Scientific notation (1e18) accepted.
**Fix:** Add explicit validation:
```javascript
const rawValue = elements.swapAmount?.value?.trim() || '';
if (!/^\d+(\.\d{1,9})?$/.test(rawValue)) {
  alert('Invalid amount format');
  return;
}
const amount = parseFloat(rawValue);
```

### 3. Missing Rate Limiting on Wallet Connect
**File:** `swap.js` lines 335-349
**Problem:** No debounce on connect button. Rapid clicks = multiple wallet popups.
**Fix:** Add connection state check or debounce.

---

## Warnings (SHOULD FIX)

### 1. Memory Leak - Event Listeners Never Removed
**File:** `swap.js` lines 83-91
**Problem:** `WalletManager.listeners` array grows indefinitely. No `off()` method.
**Impact:** Long sessions accumulate listeners.
**Fix:** Add `removeListener` method or use WeakMap pattern.

### 2. Hardcoded Testnet Configuration
**File:** `swap.js` lines 7-14
```javascript
const WALRUS_CONFIG = { ... };
const RPC_URL = 'https://fullnode.testnet.sui.io:443';
```
**Problem:** No environment detection. Cannot switch networks without code change.
**Suggestion:** Use config object or env-based detection.

### 3. Console.log in Production Code
**File:** `swap.js` lines 17, 109-110, 260, 273, 341
**Problem:** Debug logs leak info to console.
**Fix:** Remove or wrap in DEBUG flag.

### 4. No Transaction Gas Estimation
**File:** `swap.js` line 188
```javascript
const gasReserve = 0.05;
```
**Problem:** Hardcoded gas reserve may be insufficient for some txns or wasteful for simple ones.
**Suggestion:** Use `suiClient.dryRunTransaction()` for accurate estimation.

### 5. Balance Display Precision Loss
**File:** `swap.js` line 76
```javascript
this.balance = parseInt(balanceData.totalBalance) / 1_000_000_000;
```
**Problem:** parseInt on string can lose precision for large numbers.
**Fix:** Use BigInt division or dedicated decimal library.

### 6. No Retry Logic for RPC Failures
**File:** `swap.js` lines 71-80
**Problem:** Single balance fetch failure silently logged. No retry or user feedback.

---

## Suggestions (NICE TO HAVE)

### 1. Transaction Confirmation UX
Currently shows success immediately after tx submission. Consider waiting for confirmation:
```javascript
await suiClient.waitForTransaction({ digest: result.digest });
```

### 2. Loading States for Balance Refresh
No spinner during balance fetch. User might think balance is stale.

### 3. Toast Accessibility
Toasts lack `role="alert"` and `aria-live="polite"` for screen readers.

### 4. Mobile Responsiveness
Wallet section in nav (`#wallet-section`) uses `hidden md:flex` - wallet UI invisible on mobile.

### 5. Error Message Specificity
Generic "Transaction failed" message. Parse common errors:
- User rejected
- Insufficient gas
- Pool liquidity issues

### 6. Cleanup console.log Statements
Remove debug logging before production:
- Line 17: `console.log('Swap module loaded...')`
- Line 109-110: Wallet enumeration
- Line 260: Swap success log

### 7. Consider Using AbortController
For async operations that may need cancellation during unmount/navigation.

---

## Positive Observations

1. **Good XSS Protection in Error Toast** - Uses `escapeHtml()` for error messages (line 313)
2. **Proper Wallet Standard API Usage** - Correctly filters for `sui:signAndExecuteTransaction` feature
3. **Event-Driven Architecture** - WalletManager uses simple pub/sub pattern, easy to extend
4. **Gas Reserve Logic** - Prevents failed txns from insufficient gas for MAX swap
5. **Loading State Management** - Button properly disabled during transaction
6. **Import Map Pattern** - Clean ES module loading without bundler

---

## Architecture Notes

### Class Design: WalletManager
- Single responsibility: manages wallet connection state
- Clean interface: connect/disconnect/refreshBalance
- Observable pattern for UI updates
- Could benefit from TypeScript for type safety

### Separation of Concerns
- UI logic separated from wallet management
- Transaction building isolated in `buildSwapTransaction()`
- Could extract toast notifications to separate utility

---

## Metrics
- Type Coverage: N/A (vanilla JS)
- Test Coverage: N/A (no tests found)
- Linting Issues: ~6 console.log statements to remove

---

## Recommended Actions (Priority Order)

1. **[CRITICAL]** Add transaction digest validation before HTML insertion
2. **[CRITICAL]** Add proper amount input validation regex
3. **[HIGH]** Add debounce/guard on connect button
4. **[MEDIUM]** Remove console.log statements
5. **[MEDIUM]** Add listener cleanup to WalletManager
6. **[LOW]** Add accessibility attributes to toasts
7. **[LOW]** Consider mobile wallet UI visibility

---

## Unresolved Questions

1. Is testnet-only deployment intentional? If mainnet needed, config externalization required.
2. Should swap have minimum/maximum amount limits?
3. Is WAL token balance display planned? Currently only shows SUI balance.
4. Error handling for wallet extension not installed - should suggest specific wallet?
