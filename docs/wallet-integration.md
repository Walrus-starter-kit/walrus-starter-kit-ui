# Wallet Integration Guide

## Overview

Wallet Standard-based integration supporting all Sui-compatible wallets. No wallet-specific code required - works with Sui Wallet, Slush, Suiet, Ethos, etc.

## Implementation

### Detection

Uses `@wallet-standard/app` to discover installed wallets:

```javascript
import { getWallets } from '@wallet-standard/app';

getSuiWallets() {
  const { get } = getWallets();
  return get().filter(w =>
    w.features['sui:signAndExecuteTransaction'] !== undefined
  );
}
```

Filters for wallets supporting Sui transaction signing.

### Connection Flow

**1. User Initiates Connection**
```javascript
await walletManager.connect();
```

**2. Wallet Selection** (auto-selects first if only one installed)
```javascript
const wallets = this.getSuiWallets();
if (wallets.length === 0) throw new Error('No Sui wallet found');
wallet = wallets[0];
```

**3. Standard Connect Feature**
```javascript
const connectFeature = wallet.features['standard:connect'];
const { accounts } = await connectFeature.connect();
this.account = accounts[0];
```

**4. Balance Fetch**
```javascript
const balanceData = await suiClient.getBalance({
  owner: this.account.address,
});
this.balance = parseInt(balanceData.totalBalance) / 1_000_000_000;
```

**5. UI Update via Events**
```javascript
this.emit('connected', { account: this.account });
```

## API Reference

### WalletManager Methods

**`connect(wallet?)`**
- Initiates connection to Sui wallet
- Auto-selects if wallet param omitted
- Throws if no compatible wallet found
- Emits `connected` event on success

**`disconnect()`**
- Calls wallet's disconnect feature if available
- Clears local account state
- Resets balance to 0
- Emits `disconnected` event

**`refreshBalance()`**
- Fetches current SUI balance via RPC
- Converts from MIST (10^-9 SUI)
- Emits `balanceUpdated` event
- Silent fail if account not connected

**`getAddress()`**
- Returns full Sui address string
- Returns `null` if not connected

**`getAddressShort()`**
- Returns truncated address (6 chars...4 chars)
- Format: `0x1234...abcd`
- Returns `null` if not connected

**`on(event, callback)`**
- Subscribe to events: `connected`, `disconnected`, `balanceUpdated`
- Callback receives event-specific data

### Events

**`connected`** - Fired after successful wallet connection
```javascript
walletManager.on('connected', ({ account }) => {
  console.log('Connected:', account.address);
});
```

**`disconnected`** - Fired after wallet disconnect
```javascript
walletManager.on('disconnected', () => {
  console.log('Wallet disconnected');
});
```

**`balanceUpdated`** - Fired when balance refreshes
```javascript
walletManager.on('balanceUpdated', ({ balance }) => {
  console.log('New balance:', balance, 'SUI');
});
```

## UI Integration

### Navbar Wallet Section

**Disconnected State**
```html
<button id="connect-wallet-btn">Connect Wallet</button>
```

**Connected State**
```html
<div id="wallet-info" class="flex items-center gap-2">
  <span id="wallet-address">0x1234...abcd</span>
  <button id="disconnect-btn">Disconnect</button>
</div>
```

### Event Bindings

```javascript
elements.connectBtn.addEventListener('click', async () => {
  await walletManager.connect();
});

elements.disconnectBtn.addEventListener('click', async () => {
  await walletManager.disconnect();
});

walletManager.on('connected', ({ account }) => {
  elements.connectBtn.classList.add('hidden');
  elements.walletInfo.classList.remove('hidden');
  elements.walletAddress.textContent = walletManager.getAddressShort();
});

walletManager.on('disconnected', () => {
  elements.connectBtn.classList.remove('hidden');
  elements.walletInfo.classList.add('hidden');
});
```

## Supported Wallets

All wallets implementing Wallet Standard for Sui:

- **Sui Wallet** (official)
- **Slush Wallet**
- **Suiet Wallet**
- **Ethos Wallet**
- **Martian Wallet**
- Any future Wallet Standard-compatible wallet

No code changes needed to support new wallets.

## Error Handling

### No Wallet Installed
```javascript
if (wallets.length === 0) {
  throw new Error('No Sui wallet found. Please install Sui Wallet extension.');
}
```

User sees alert: "Failed to connect: No Sui wallet found..."

### Connection Rejected
```javascript
try {
  await walletManager.connect();
} catch (err) {
  alert('Failed to connect: ' + err.message);
}
```

### Multiple Connect Attempts (Debounce)
```javascript
let isConnecting = false;
elements.connectBtn.addEventListener('click', async () => {
  if (isConnecting) return; // Prevent double-click
  isConnecting = true;
  // ... connect logic
  isConnecting = false;
});
```

### Balance Fetch Failure
```javascript
try {
  const balanceData = await suiClient.getBalance({ owner });
  this.balance = parseInt(balanceData.totalBalance) / 1_000_000_000;
} catch (error) {
  console.error('Failed to fetch balance:', error);
  // Silent fail - UI shows last known balance or '--'
}
```

## Transaction Signing

### Sign and Execute Pattern

```javascript
const signFeature = wallet.features['sui:signAndExecuteTransaction'];
if (!signFeature) {
  throw new Error('Wallet does not support transaction signing');
}

const result = await signFeature.signAndExecuteTransaction({
  transaction: tx,
  account: walletManager.account,
  chain: 'sui:testnet',
});
```

### Transaction Object
Must be built using `@mysten/sui/transactions`:
```javascript
import { Transaction } from '@mysten/sui/transactions';
const tx = new Transaction();
// ... build transaction
```

### Result Format
```javascript
{
  digest: 'ABC123...', // Transaction hash
  // Additional wallet-specific fields
}
```

## Network Configuration

### Testnet (Current)
```javascript
const RPC_URL = 'https://fullnode.testnet.sui.io:443';
const suiClient = new SuiClient({ url: RPC_URL });
```

Transaction chain ID: `'sui:testnet'`

### Mainnet Migration
```javascript
const RPC_URL = 'https://fullnode.mainnet.sui.io:443';
```

Transaction chain ID: `'sui:mainnet'`

Update both RPC client and transaction chain parameter.

## Security Best Practices

### Address Validation
Always validate address format before use:
```javascript
const addr = walletManager.getAddress();
if (!addr || !addr.startsWith('0x')) {
  throw new Error('Invalid address');
}
```

### Transaction Verification
Never trust user input in transaction construction:
```javascript
const amountMist = BigInt(Math.floor(amount * 1_000_000_000));
if (amountMist <= 0) throw new Error('Invalid amount');
```

### State Management
Clear sensitive data on disconnect:
```javascript
async disconnect() {
  this.wallet = null;
  this.account = null;
  this.balance = 0;
  // No private keys stored - wallet manages all secrets
}
```

## Debugging

### Console Logging
Module logs key events:
```javascript
console.log('Swap module loaded. SuiClient:', suiClient);
console.log('Available Sui wallets:', wallets.length);
wallets.forEach(w => console.log('- ' + w.name));
```

### Common Issues

**"Wallet does not support connect"**
- Wallet extension outdated
- Non-standard wallet implementation
- Solution: Update extension or try different wallet

**"No accounts returned"**
- Wallet not initialized
- No accounts created in wallet
- Solution: Create account in wallet extension

**Balance shows 0 on testnet**
- No testnet SUI in wallet
- Solution: Request from testnet faucet

## Testing Checklist

- [ ] Connect with Sui Wallet
- [ ] Connect with alternative wallet (Slush/Suiet)
- [ ] Verify address truncation
- [ ] Verify balance display (MIST → SUI conversion)
- [ ] Disconnect and reconnect
- [ ] Reject connection → verify error handling
- [ ] Switch accounts in wallet → verify address update
- [ ] No wallet installed → verify error message
- [ ] Multiple rapid connect clicks → verify debounce
