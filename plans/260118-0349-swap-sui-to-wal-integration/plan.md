---
title: "SUI to WAL Swap Integration"
description: "Convert React swap component to vanilla JS for HTML-based landing page"
status: completed
priority: P1
effort: 6h
branch: main
tags: [sui, wallet, swap, vanilla-js, integration]
created: 2026-01-18
completed: 2026-01-18
---

# SUI to WAL Swap Integration Plan

## Summary

Convert React-based SUI-to-WAL swap functionality from `my-walrus-app/src/App.tsx` to vanilla JavaScript that integrates with existing HTML landing page (`index.html`).

## Source Analysis

**React Component Features (App.tsx):**
- Wallet connection via `@mysten/dapp-kit` ConnectButton
- Balance query via `useSuiClientQuery('getBalance')`
- Transaction signing via `useSignAndExecuteTransaction`
- Amount input with MAX button (reserves 0.05 SUI for gas)
- Loading states, error handling, validation

**Target Environment:**
- Static HTML with Tailwind CSS (CDN)
- Existing glass-card design system
- No build step, pure browser JS

## Technical Approach

Use `@wallet-standard/app` + `@mysten/sui` for vanilla JS wallet integration:

```javascript
// Wallet detection
import { getWallets } from '@wallet-standard/app';
const { get } = getWallets();
const suiWallets = get().filter(w => w.features['sui:signAndExecuteTransaction']);

// Connect
const { accounts } = await wallet.features['standard:connect'].connect();

// Transaction
const { Transaction } = await import('@mysten/sui/transactions');
const tx = new Transaction();
// ... build tx
await wallet.features['sui:signAndExecuteTransaction'].signAndExecuteTransaction({ transaction: tx });
```

## Phases

| Phase | Description | Status | Est |
|-------|-------------|--------|-----|
| 01 | Setup Dependencies | ✅ completed | 1h |
| 02 | Implement Wallet Connection | ✅ completed | 1.5h |
| 03 | Implement Swap UI | ✅ completed | 1.5h |
| 04 | Implement Swap Logic | ✅ completed | 1.5h |
| 05 | Testing | ✅ completed | 0.5h |

## Dependencies

- `@mysten/sui` v1.45.2+ (ESM CDN: esm.sh)
- `@wallet-standard/app` (ESM CDN: esm.sh)
- Sui Wallet browser extension (Slush, Sui Wallet, etc.)

## Key Configuration

```javascript
const WALRUS_CONFIG = {
  PACKAGE_ID: '0x82593828ed3fcb8c6a235eac9abd0adbe9c5f9bbffa9b1e7a45cdd884481ef9f',
  MODULE: 'wal_exchange',
  FUNCTION: 'exchange_all_for_wal',
  POOL_OBJECT_ID: '0xf4d164ea2def5fe07dc573992a029e010dba09b1a8dcbc44c5c2e79567f39073',
};
const NETWORK = 'testnet';
const RPC_URL = 'https://fullnode.testnet.sui.io:443';
```

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `swap.js` - Main swap logic module |
| Modify | `index.html` - Add swap section + script imports |

## Success Criteria

- [x] Wallet connect/disconnect works
- [x] Balance displays correctly
- [x] Swap transaction executes successfully
- [x] MAX button calculates correctly (balance - 0.05 SUI)
- [x] Error states display appropriately
- [x] Loading states during transaction
- [x] Matches existing design system

## Unresolved Questions

1. **CDN bundling** - esm.sh may have issues with @mysten/sui tree-shaking. May need to test unpkg/skypack alternatives.
2. **Wallet compatibility** - Need to verify which Sui wallets support wallet-standard in browser (Sui Wallet, Slush confirmed).
3. **Transaction gas estimation** - React version hardcodes 0.05 SUI for gas. May need dynamic estimation.
