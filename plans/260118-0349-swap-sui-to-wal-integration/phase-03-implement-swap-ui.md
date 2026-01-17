---
phase: 03
title: Implement Swap UI
status: completed
priority: P1
effort: 1.5h
completed: 2026-01-18
---

# Phase 03: Implement Swap UI

## Context

- [Phase 02: Wallet Connection](./phase-02-implement-wallet-connection.md)
- [React reference: App.tsx lines 99-152](../../../my-walrus-app/src/App.tsx)
- [Design reference: index.html glass-card pattern](../../../index.html)

## Overview

Create swap card UI matching existing glass-card design. Convert React JSX to HTML with Tailwind classes.

## Key Insights

- React component uses inline styles; convert to Tailwind
- Existing index.html has `.glass-card` and `.glass-card-hover` CSS classes
- Follow "LAYER" section design pattern for consistent UX

## Requirements

### Functional
- Amount input field (number type)
- MAX button (sets balance - 0.05 SUI)
- "SUI" label next to input
- Balance display
- Swap button with loading state
- Validation message for insufficient balance
- Warning when wallet not connected

### Non-functional
- Match glass-card aesthetic
- Responsive layout
- Accessible form elements

## Architecture

```
Swap Card Structure:
+---------------------------+
| Buy WAL (Testnet)         |
|---------------------------|
| Balance:        X.XXXX SUI|
|---------------------------|
| [Input] [MAX] SUI         |
|---------------------------|
| [  Swap to WAL  ]         |
|---------------------------|
| (error messages)          |
+---------------------------+
```

## Related Code Files

### Modify
- `index.html` - Add swap card section

### Reference
- Existing glass-card sections in index.html

## Implementation Steps

1. Create new section after hero for swap card
2. Add swap card HTML structure
3. Style with existing Tailwind/glass-card classes
4. Add reveal animation class for scroll effect
5. Connect to WalletManager events for dynamic updates

## Code Implementation

### index.html - Add swap section after hero section

```html
<!-- Swap Section - Add after hero section (after line ~258) -->
<section id="swap-section" class="py-16 px-6 relative">
    <div class="max-w-md mx-auto reveal">
        <div class="glass-card glass-card-hover rounded-xl p-8 border border-white/10">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold font-mono text-white">Buy WAL</h3>
                <span class="px-2 py-1 text-[10px] font-mono border border-primary/30 text-primary rounded bg-primary/5">
                    TESTNET
                </span>
            </div>

            <!-- Balance Display -->
            <div id="swap-balance-row" class="flex justify-between text-sm font-mono mb-4">
                <span class="text-gray-400">Balance:</span>
                <span id="swap-balance" class="text-white font-bold">
                    <span id="balance-value">--</span> SUI
                </span>
            </div>

            <!-- Input Row -->
            <div class="flex gap-3 mb-6">
                <div class="flex-1 relative">
                    <input
                        type="number"
                        id="swap-amount"
                        value="1"
                        min="0"
                        step="0.0001"
                        placeholder="0.00"
                        class="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-lg focus:border-primary focus:outline-none transition-colors"
                    />
                </div>
                <div class="flex items-center gap-2">
                    <button
                        id="max-btn"
                        class="px-3 py-1 text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary/20 transition-colors"
                    >
                        MAX
                    </button>
                    <span class="text-white font-mono font-bold">SUI</span>
                </div>
            </div>

            <!-- Swap Button -->
            <button
                id="swap-btn"
                disabled
                class="w-full py-4 rounded-lg font-mono font-bold text-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 bg-primary text-black hover:bg-primary-dark"
            >
                Connect Wallet to Swap
            </button>

            <!-- Error/Warning Messages -->
            <div id="swap-messages" class="mt-4 text-center">
                <p id="insufficient-balance-msg" class="hidden text-red-400 text-sm font-mono">
                    Insufficient balance
                </p>
                <p id="connect-wallet-msg" class="text-gray-500 text-sm font-mono">
                    Connect wallet above to swap SUI for WAL
                </p>
            </div>
        </div>
    </div>
</section>
```

### swap.js - UI update functions

```javascript
// UI Elements
const elements = {
  swapAmount: null,
  balanceValue: null,
  maxBtn: null,
  swapBtn: null,
  insufficientMsg: null,
  connectMsg: null,
};

function initElements() {
  elements.swapAmount = document.getElementById('swap-amount');
  elements.balanceValue = document.getElementById('balance-value');
  elements.maxBtn = document.getElementById('max-btn');
  elements.swapBtn = document.getElementById('swap-btn');
  elements.insufficientMsg = document.getElementById('insufficient-balance-msg');
  elements.connectMsg = document.getElementById('connect-wallet-msg');
}

function updateSwapUI() {
  const { swapAmount, balanceValue, swapBtn, insufficientMsg, connectMsg } = elements;

  if (!walletManager.connected) {
    balanceValue.textContent = '--';
    swapBtn.disabled = true;
    swapBtn.textContent = 'Connect Wallet to Swap';
    insufficientMsg?.classList.add('hidden');
    connectMsg?.classList.remove('hidden');
    return;
  }

  // Update balance
  balanceValue.textContent = walletManager.balance.toFixed(4);
  connectMsg?.classList.add('hidden');

  // Validate amount
  const amount = parseFloat(swapAmount.value) || 0;
  const hasInsufficientBalance = amount > walletManager.balance;

  if (hasInsufficientBalance) {
    insufficientMsg?.classList.remove('hidden');
    swapBtn.disabled = true;
    swapBtn.textContent = 'Insufficient Balance';
  } else if (amount <= 0) {
    insufficientMsg?.classList.add('hidden');
    swapBtn.disabled = true;
    swapBtn.textContent = 'Enter Amount';
  } else {
    insufficientMsg?.classList.add('hidden');
    swapBtn.disabled = false;
    swapBtn.textContent = 'Swap to WAL';
  }
}

function handleMaxClick() {
  if (!walletManager.connected) return;

  const gasReserve = 0.05;
  const maxAmount = Math.max(0, walletManager.balance - gasReserve);
  elements.swapAmount.value = maxAmount.toFixed(4);
  updateSwapUI();
}

// Event bindings (add to DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  initElements();

  elements.swapAmount?.addEventListener('input', updateSwapUI);
  elements.maxBtn?.addEventListener('click', handleMaxClick);

  walletManager.on('connected', updateSwapUI);
  walletManager.on('disconnected', updateSwapUI);
  walletManager.on('balanceUpdated', updateSwapUI);
});
```

## Todo

- [ ] Add swap section HTML to index.html
- [ ] Add UI update functions to swap.js
- [ ] Wire up MAX button
- [ ] Wire up input validation
- [ ] Test UI states (connected/disconnected/insufficient)

## Success Criteria

- [ ] Swap card renders in glass-card style
- [ ] Balance shows "--" when disconnected
- [ ] Balance shows SUI amount when connected
- [ ] MAX button sets input to balance - 0.05
- [ ] Insufficient balance warning appears correctly
- [ ] Swap button state changes appropriately

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Number input precision | Use toFixed(4), step="0.0001" |
| Negative amounts | min="0" attribute + JS validation |
| Layout shift | Fixed height messages area |

## Security Considerations

- Sanitize input values before use
- Validate amounts client-side AND server-side (transaction will fail anyway)

## Next Steps

Phase 04: Implement swap transaction logic
