---
phase: 02
title: Implement Wallet Connection
status: completed
priority: P1
effort: 1.5h
completed: 2026-01-18
---

# Phase 02: Implement Wallet Connection

## Context

- [Phase 01: Setup Dependencies](./phase-01-setup-dependencies.md)
- [React reference: App.tsx lines 6-10, 30-31](../../../my-walrus-app/src/App.tsx)

## Overview

Implement wallet detection, connection, and disconnection using `@wallet-standard/app` in vanilla JavaScript.

## Key Insights

- React's `useCurrentAccount` maps to wallet's `accounts` array
- React's `ConnectButton` handles UI + connection; we build custom
- Wallet-standard provides `standard:connect` and `standard:disconnect` features
- Must filter wallets for Sui support via `sui:signAndExecuteTransaction` feature

## Requirements

### Functional
- Detect installed Sui-compatible wallets
- Display connect button (or wallet selector if multiple)
- Show connected address (truncated)
- Disconnect functionality
- Persist connection state in sessionStorage

### Non-functional
- Match existing glass-card design
- Responsive (mobile-friendly)
- Graceful handling of no wallet installed

## Architecture

```
State Management (vanilla):
- walletState = { wallet: null, account: null, connected: false }
- Event-driven updates via custom events or direct DOM manipulation

Wallet Detection Flow:
1. getWallets().get() -> filter for sui:signAndExecuteTransaction
2. If 0 wallets: show "Install Wallet" link
3. If 1 wallet: direct connect button
4. If 2+ wallets: dropdown selector
```

## Related Code Files

### Modify
- `swap.js` - Add wallet connection logic

### Reference (design patterns)
- `dashboard.js` - Existing vanilla JS patterns in project

## Implementation Steps

1. Create WalletManager class in swap.js
2. Implement `detectWallets()` method
3. Implement `connect(wallet)` method
4. Implement `disconnect()` method
5. Implement `getBalance()` method using SuiClient
6. Add DOM elements for connect button to index.html (placeholder in swap section)
7. Wire up event listeners

## Code Implementation

### swap.js - WalletManager class

```javascript
class WalletManager {
  constructor() {
    this.wallet = null;
    this.account = null;
    this.connected = false;
    this.balance = 0;
    this.listeners = [];
  }

  getSuiWallets() {
    const { get } = getWallets();
    return get().filter(w =>
      w.features['sui:signAndExecuteTransaction'] !== undefined
    );
  }

  async connect(wallet) {
    if (!wallet) {
      const wallets = this.getSuiWallets();
      if (wallets.length === 0) throw new Error('No Sui wallet found');
      wallet = wallets[0];
    }

    const connectFeature = wallet.features['standard:connect'];
    if (!connectFeature) throw new Error('Wallet does not support connect');

    const { accounts } = await connectFeature.connect();
    if (accounts.length === 0) throw new Error('No accounts returned');

    this.wallet = wallet;
    this.account = accounts[0];
    this.connected = true;

    await this.refreshBalance();
    this.emit('connected', { account: this.account });
  }

  async disconnect() {
    if (this.wallet?.features['standard:disconnect']) {
      await this.wallet.features['standard:disconnect'].disconnect();
    }
    this.wallet = null;
    this.account = null;
    this.connected = false;
    this.balance = 0;
    this.emit('disconnected');
  }

  async refreshBalance() {
    if (!this.account) return;

    const balanceData = await suiClient.getBalance({
      owner: this.account.address,
    });

    this.balance = parseInt(balanceData.totalBalance) / 1_000_000_000;
    this.emit('balanceUpdated', { balance: this.balance });
  }

  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  emit(event, data) {
    this.listeners
      .filter(l => l.event === event)
      .forEach(l => l.callback(data));
  }

  getAddress() {
    return this.account?.address || null;
  }

  getAddressShort() {
    const addr = this.getAddress();
    if (!addr) return null;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
}
```

### index.html - Wallet connect button (in nav or new section)

```html
<!-- Add to nav, after the existing links -->
<div id="wallet-section" class="flex items-center gap-2">
  <button id="connect-wallet-btn"
    class="px-4 py-2 rounded bg-primary text-black font-mono text-sm font-bold hover:bg-primary-dark transition-colors">
    Connect Wallet
  </button>
  <div id="wallet-info" class="hidden items-center gap-2">
    <span id="wallet-address" class="text-xs font-mono text-gray-400"></span>
    <button id="disconnect-btn" class="text-xs text-red-400 hover:text-red-300">
      Disconnect
    </button>
  </div>
</div>
```

### swap.js - DOM wiring

```javascript
const walletManager = new WalletManager();

document.addEventListener('DOMContentLoaded', () => {
  const connectBtn = document.getElementById('connect-wallet-btn');
  const disconnectBtn = document.getElementById('disconnect-btn');
  const walletInfo = document.getElementById('wallet-info');
  const walletAddress = document.getElementById('wallet-address');

  connectBtn?.addEventListener('click', async () => {
    try {
      connectBtn.disabled = true;
      connectBtn.textContent = 'Connecting...';
      await walletManager.connect();
    } catch (err) {
      alert('Failed to connect: ' + err.message);
    } finally {
      connectBtn.disabled = false;
      connectBtn.textContent = 'Connect Wallet';
    }
  });

  disconnectBtn?.addEventListener('click', async () => {
    await walletManager.disconnect();
  });

  walletManager.on('connected', ({ account }) => {
    connectBtn?.classList.add('hidden');
    walletInfo?.classList.remove('hidden');
    walletInfo?.classList.add('flex');
    if (walletAddress) {
      walletAddress.textContent = walletManager.getAddressShort();
    }
  });

  walletManager.on('disconnected', () => {
    connectBtn?.classList.remove('hidden');
    walletInfo?.classList.add('hidden');
    walletInfo?.classList.remove('flex');
  });
});
```

## Todo

- [ ] Add WalletManager class to swap.js
- [ ] Add wallet connect button to index.html nav
- [ ] Wire up connect/disconnect events
- [ ] Test with Sui Wallet extension
- [ ] Handle "no wallet installed" state

## Success Criteria

- [ ] Connect button visible in nav
- [ ] Clicking connect opens wallet popup
- [ ] After approval, address displays truncated
- [ ] Disconnect clears state
- [ ] Balance fetched after connect

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Wallet popup blocked | User must allow popups |
| Multiple wallets confusion | Show wallet name, add selector later |
| RPC rate limiting | Use reasonable refetch intervals |

## Security Considerations

- Never store private keys
- Validate wallet features before calling
- Sanitize address display (XSS)

## Next Steps

Phase 03: Implement Swap UI (amount input, MAX button, swap card)
