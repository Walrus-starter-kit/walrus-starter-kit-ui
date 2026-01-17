---
phase: 04
title: Implement Swap Logic
status: completed
priority: P1
effort: 1.5h
completed: 2026-01-18
---

# Phase 04: Implement Swap Logic

## Context

- [Phase 03: Swap UI](./phase-03-implement-swap-ui.md)
- [React reference: App.tsx lines 49-88](../../../my-walrus-app/src/App.tsx)

## Overview

Implement the actual swap transaction using Sui SDK Transaction class and wallet-standard signing.

## Key Insights

- Transaction flow: splitCoins -> moveCall -> transferObjects
- React uses `signAndExecuteTransaction` hook; vanilla uses wallet feature directly
- Must handle both success and error states

## Requirements

### Functional
- Build transaction with correct parameters
- Sign and execute via wallet
- Display success message with transaction hash
- Handle errors gracefully
- Show loading state during transaction
- Refresh balance after successful swap

### Non-functional
- Transaction must complete within reasonable time
- User feedback during all states

## Architecture

```
Swap Transaction Flow:
1. User clicks "Swap to WAL"
2. Disable button, show "Processing..."
3. Build Transaction:
   a. splitCoins(gas, [amount in MIST])
   b. moveCall(wal_exchange::exchange_all_for_wal)
   c. transferObjects([result], sender)
4. Call wallet.features['sui:signAndExecuteTransaction']
5. On success: alert, refresh balance
6. On error: show error message
7. Re-enable button
```

## Related Code Files

### Modify
- `swap.js` - Add swap transaction logic

## Implementation Steps

1. Create `buildSwapTransaction()` function
2. Create `executeSwap()` function
3. Wire to swap button click
4. Add loading state handling
5. Add success/error feedback

## Code Implementation

### swap.js - Swap transaction functions

```javascript
async function buildSwapTransaction(amountSui) {
  const tx = new Transaction();
  const amountMist = BigInt(Math.floor(amountSui * 1_000_000_000));

  // Split coins from gas
  const [coinToSwap] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

  // Call the exchange function
  const [walCoin] = tx.moveCall({
    target: `${WALRUS_CONFIG.PACKAGE_ID}::${WALRUS_CONFIG.MODULE}::${WALRUS_CONFIG.FUNCTION}`,
    arguments: [
      tx.object(WALRUS_CONFIG.POOL_OBJECT_ID),
      coinToSwap,
    ],
  });

  // Transfer the result WAL to the sender
  tx.transferObjects([walCoin], tx.pure.address(walletManager.getAddress()));

  return tx;
}

async function executeSwap() {
  if (!walletManager.connected || !walletManager.wallet) {
    alert('Please connect your wallet first');
    return;
  }

  const amount = parseFloat(elements.swapAmount.value) || 0;
  if (amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  if (amount > walletManager.balance) {
    alert('Insufficient balance');
    return;
  }

  // Update UI to loading state
  const swapBtn = elements.swapBtn;
  const originalText = swapBtn.textContent;
  swapBtn.disabled = true;
  swapBtn.textContent = 'Processing...';
  swapBtn.classList.add('animate-pulse');

  try {
    // Build transaction
    const tx = await buildSwapTransaction(amount);

    // Get the signing feature from wallet
    const signFeature = walletManager.wallet.features['sui:signAndExecuteTransaction'];
    if (!signFeature) {
      throw new Error('Wallet does not support transaction signing');
    }

    // Execute transaction
    const result = await signFeature.signAndExecuteTransaction({
      transaction: tx,
      account: walletManager.account,
      chain: 'sui:testnet',
    });

    console.log('Swap successful:', result);

    // Show success message
    showSuccessMessage(result.digest);

    // Refresh balance
    await walletManager.refreshBalance();

    // Clear input
    elements.swapAmount.value = '';
    updateSwapUI();

  } catch (error) {
    console.error('Swap failed:', error);
    showErrorMessage(error.message || 'Transaction failed');
  } finally {
    // Restore button state
    swapBtn.disabled = false;
    swapBtn.textContent = originalText;
    swapBtn.classList.remove('animate-pulse');
    updateSwapUI();
  }
}

function showSuccessMessage(digest) {
  // Create toast notification
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 bg-green-500/90 text-white px-6 py-4 rounded-lg shadow-lg font-mono text-sm z-50 flex items-center gap-3';
  toast.innerHTML = `
    <span class="material-symbols-outlined">check_circle</span>
    <div>
      <p class="font-bold">Swap Successful!</p>
      <a href="https://suiscan.xyz/testnet/tx/${digest}" target="_blank" class="text-xs underline hover:no-underline">
        View on Explorer
      </a>
    </div>
  `;
  document.body.appendChild(toast);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function showErrorMessage(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-4 rounded-lg shadow-lg font-mono text-sm z-50 flex items-center gap-3';
  toast.innerHTML = `
    <span class="material-symbols-outlined">error</span>
    <div>
      <p class="font-bold">Swap Failed</p>
      <p class="text-xs">${escapeHtml(message)}</p>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // ... existing init code ...

  elements.swapBtn?.addEventListener('click', executeSwap);
});
```

## Todo

- [ ] Add buildSwapTransaction function
- [ ] Add executeSwap function
- [ ] Add toast notification functions
- [ ] Wire swap button to executeSwap
- [ ] Test complete swap flow

## Success Criteria

- [ ] Transaction builds correctly
- [ ] Wallet popup appears for signing
- [ ] Success toast shows with explorer link
- [ ] Error toast shows on failure
- [ ] Balance updates after swap
- [ ] Button shows loading state during transaction

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Transaction fails | Show clear error, don't lose user's input |
| Network timeout | Add timeout handling, allow retry |
| Wrong network | Validate chain in wallet matches testnet |
| Amount precision loss | Use BigInt for MIST calculations |

## Security Considerations

- Escape HTML in error messages
- Validate all inputs before transaction
- Use tx.pure for user-provided values

## Next Steps

Phase 05: Testing all flows end-to-end
