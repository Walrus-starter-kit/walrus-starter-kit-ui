---
phase: 01
title: Setup Dependencies
status: completed
priority: P1
effort: 1h
completed: 2026-01-18
---

# Phase 01: Setup Dependencies

## Context

- [Source: my-walrus-app/src/App.tsx](../../../my-walrus-app/src/App.tsx)
- [Target: index.html](../../../index.html)

## Overview

Configure ESM imports for Sui SDK libraries via CDN. No build step required.

## Key Insights

- `@mysten/dapp-kit` is React-only; must use lower-level `@wallet-standard/app` for vanilla JS
- `@mysten/sui` works in browser via ESM
- esm.sh provides reliable ES module CDN hosting with proper bundling

## Requirements

### Functional
- Import Sui SDK Transaction class
- Import wallet-standard for wallet detection
- Import SuiClient for RPC queries

### Non-functional
- No build tooling
- Browser-native ES modules
- Fast CDN loading

## Architecture

```
index.html
  |-- <script type="importmap">
  |     @mysten/sui -> esm.sh
  |     @wallet-standard/app -> esm.sh
  |
  |-- <script type="module" src="swap.js">
```

## Implementation Steps

1. Add import map to `index.html` head section
2. Create `swap.js` skeleton file
3. Test that imports resolve correctly in browser console

## Code Changes

### index.html - Add before closing </head>

```html
<script type="importmap">
{
  "imports": {
    "@mysten/sui/": "https://esm.sh/@mysten/sui@1.45.2/",
    "@wallet-standard/app": "https://esm.sh/@wallet-standard/app@1.1.0"
  }
}
</script>
```

### index.html - Add before closing </body>

```html
<script type="module" src="swap.js"></script>
```

### swap.js - Initial skeleton

```javascript
// swap.js - SUI to WAL Swap Module

import { getWallets } from '@wallet-standard/app';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

const WALRUS_CONFIG = {
  PACKAGE_ID: '0x82593828ed3fcb8c6a235eac9abd0adbe9c5f9bbffa9b1e7a45cdd884481ef9f',
  MODULE: 'wal_exchange',
  FUNCTION: 'exchange_all_for_wal',
  POOL_OBJECT_ID: '0xf4d164ea2def5fe07dc573992a029e010dba09b1a8dcbc44c5c2e79567f39073',
};

const RPC_URL = 'https://fullnode.testnet.sui.io:443';
const suiClient = new SuiClient({ url: RPC_URL });

console.log('Swap module loaded. SuiClient:', suiClient);
console.log('Available wallets:', getWallets().get());
```

## Todo

- [ ] Add import map to index.html
- [ ] Create swap.js with imports
- [ ] Verify imports work in browser DevTools
- [ ] Confirm wallet detection logs installed wallets

## Success Criteria

- Browser console shows "Swap module loaded" message
- `getWallets().get()` returns array (may be empty if no wallet installed)
- No import/module errors in console

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| esm.sh CDN downtime | Fallback to unpkg.com or skypack.dev |
| Import map browser support | All modern browsers support; IE11 N/A |
| Version mismatch | Pin exact versions in import map |

## Next Steps

Phase 02: Implement wallet connection UI and logic
