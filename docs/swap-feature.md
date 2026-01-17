# Swap Feature Documentation

## Overview

Token swap interface allowing users to exchange SUI for WAL tokens on Walrus testnet. Integrated directly into landing page via glassmorphic UI card.

## Architecture

### Core Components

**WalletManager Class** (`swap.js` lines 20-104)
- Manages Sui wallet connections via Wallet Standard
- Handles account state and balance tracking
- Event-based notifications (connected, disconnected, balanceUpdated)

**Swap Transaction Builder** (`swap.js` lines 195-215)
- Constructs Sui Move transaction for token exchange
- Splits coins from gas payment
- Calls Walrus exchange contract
- Transfers resulting WAL tokens to user

**UI Controller** (`swap.js` lines 115-393)
- DOM element management
- Real-time validation (insufficient balance, invalid amounts)
- Toast notifications for success/failure
- Loading states during transaction execution

### Contract Integration

```typescript
WALRUS_CONFIG = {
  PACKAGE_ID: '0x82593828ed3fcb8c6a235eac9abd0adbe9c5f9bbffa9b1e7a45cdd884481ef9f',
  MODULE: 'wal_exchange',
  FUNCTION: 'exchange_all_for_wal',
  POOL_OBJECT_ID: '0xf4d164ea2def5fe07dc573992a029e010dba09b1a8dcbc44c5c2e79567f39073',
}
```

Network: Sui Testnet (`https://fullnode.testnet.sui.io:443`)

## User Flow

### 1. Wallet Connection
- Click "Connect Wallet" in navbar (line 172-174 index.html)
- Auto-detects Sui wallets (Sui Wallet, Slush)
- Fetches SUI balance via RPC
- Updates UI to show address (truncated) and balance

### 2. Swap Configuration
- Enter SUI amount or click "MAX" button
- MAX reserves 0.05 SUI for gas (line 188 swap.js)
- Real-time validation:
  - Amount > balance → "Insufficient Balance" error
  - Amount ≤ 0 → "Enter Amount" disabled state
  - Valid amount → "Swap to WAL" enabled

### 3. Transaction Execution
- Build transaction: split coins, call Move function, transfer WAL
- Sign via wallet popup
- Execute on testnet
- Show toast with explorer link on success
- Auto-refresh balance post-swap

### 4. Disconnect
- Click "Disconnect" in navbar
- Clears account state, resets UI to initial state

## UI Components

### Swap Card (index.html lines 286-349)
- Glassmorphic design matching site aesthetic
- Input field with number validation
- Balance display (hidden when disconnected)
- MAX button for quick fills
- Dynamic swap button states
- Error/warning message area

### Navbar Wallet Section (lines 169-182)
- Connect button (visible when disconnected)
- Wallet info panel (visible when connected)
  - Truncated address (0x1234...abcd)
  - Disconnect button

## Error Handling

### Input Validation
- Rejects scientific notation (e.g., 1e-5)
- Requires positive decimal format
- Regex: `/^\d+(\.\d+)?$/`

### Transaction Failures
- Network errors → red toast notification
- Insufficient gas → caught and displayed
- User rejection → logged, no UI spam
- All errors logged to console with full stack

### Edge Cases
- No wallet installed → alert prompts installation
- Multiple rapid clicks → debounce flag prevents double-connect
- Balance refresh failures → silent console log, UI shows last known balance

## Security Considerations

### XSS Prevention
- All user input escaped via `escapeHtml()` before rendering (lines 331-335)
- Transaction digest sanitized before displaying in toast

### Input Sanitization
- Amount parsing validates format before BigInt conversion
- Prevents injection via number input field type
- Gas reserve ensures transaction can complete

## Testing Requirements

### Manual Tests
1. **Wallet Connection**
   - Install Sui Wallet extension
   - Connect and verify address display
   - Verify balance fetch (testnet SUI required)
   - Disconnect and verify UI reset

2. **Swap Execution**
   - Enter 0.1 SUI, execute swap
   - Verify transaction on SuiScan
   - Confirm WAL tokens in wallet
   - Check balance updated post-swap

3. **Validation**
   - Enter amount > balance → verify error
   - Enter 0 → verify button disabled
   - Enter negative → verify rejection
   - Click MAX → verify gas reserve calculation

4. **Error Scenarios**
   - Reject transaction in wallet → verify error toast
   - Disconnect during transaction → verify graceful failure
   - No wallet installed → verify alert message

### Automated Test Cases (Future)
```javascript
// Unit tests needed for:
- WalletManager.connect() with mock wallet
- buildSwapTransaction() amount conversion
- validateAmount() regex patterns
- escapeHtml() XSS vectors
- MAX button gas reserve math
```

## Dependencies

**NPM Packages** (loaded via importmap, lines 132-139 index.html)
- `@mysten/sui@1.45.2` - Sui SDK (client, transactions)
- `@wallet-standard/app@1.1.0` - Wallet detection

**External Resources**
- Sui Testnet RPC
- SuiScan explorer (for transaction links)
- Sui Wallet browser extension

## Configuration

### RPC Endpoint
Change network by updating `RPC_URL` (line 14 swap.js):
```javascript
const RPC_URL = 'https://fullnode.mainnet.sui.io:443'; // Mainnet
```

### Contract Addresses
Update `WALRUS_CONFIG` for different deployments or mainnet migration.

### Gas Reserve
Modify line 188 to adjust MAX button buffer:
```javascript
const gasReserve = 0.1; // Higher reserve for complex transactions
```

## Troubleshooting

**Balance shows `--`**
- Wallet not connected or RPC error
- Check console for fetch errors
- Verify testnet connectivity

**Swap button stays disabled**
- Check input amount format (no letters, symbols)
- Ensure wallet connected
- Verify sufficient balance

**Transaction fails with "Insufficient gas"**
- Increase gas reserve in MAX calculation
- Ensure wallet has > 0.05 SUI beyond swap amount

**No wallets detected**
- Install Sui Wallet or Slush extension
- Refresh page after installation
- Check browser console for detection logs

## Future Enhancements

1. **Slippage Protection** - Add configurable slippage tolerance
2. **Price Display** - Show SUI/WAL exchange rate
3. **Transaction History** - Store past swaps in localStorage
4. **Multi-Wallet Support** - Allow user to choose wallet from list
5. **Gas Estimation** - Dynamic gas reserve based on actual transaction cost
