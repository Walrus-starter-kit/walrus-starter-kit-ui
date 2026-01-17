Sui Wallet integration in browser DApps uses the @mysten/dapp-kit for React hooks and UI components supporting all Sui wallets via adapters, including browser extensions like Sui Wallet and Suiet. WalletConnect v2 enables mobile/browser bridging; multi-wallet selectors auto-detect via window.sui. Transactions use TransactionBlock from @mysten/sui.js with automatic gas estimation and signing. [docs.sui](https://docs.sui.io/guides/suiplay0x1/wallet-integration)

## Setup Providers

Wrap your app root (e.g., main.tsx) with QueryClientProvider, SuiClientProvider, and WalletProvider for hooks to access SuiClient and wallets.

```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import '@mysten/dapp-kit/dist/index.css';
import App from './App';

const queryClient = new QueryClient();
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```


## Wallet Detection & Connection

Use `ConnectButton` for UI-driven multi-wallet modal; `useWallets()` lists available, `useConnectUI()` for programmatic switching. Auto-reconnect via WalletProvider persistence. [sdk.mystenlabs](https://sdk.mystenlabs.com/dapp-kit)

```typescript
// WalletConnect.tsx
import { ConnectButton, useWallets, useConnectUI } from '@mysten/dapp-kit';

export function WalletSection() {
  const wallets = useWallets(); // Detects extensions/WalletConnect
  const { connect } = useConnectUI();

  return (
    <div>
      <ConnectButton /> {/* Modal with all wallets */}
      {wallets.map((wallet) => (
        <button key={wallet.name} onClick={() => connect(wallet)}>
          Connect {wallet.name}
        </button>
      ))}
    </div>
  );
}
```

## Transaction Signing

Build with `Transaction`, sign via `useCurrentAccount().signAndExecuteTransaction({ transaction })`. Gas auto-estimates; handle UserRejectedError or InsufficientFundsError from `useSuiClient`. [docs.sui](https://docs.sui.io/guides/developer/sui-101/client-tssdk)

```typescript
// TxExample.tsx
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { UserRejectedError } from '@mysten/dapp-kit';

export function SendSUI({ recipient, amount }: { recipient: string; amount: number }) {
  const account = useCurrentAccount();
  const client = useSuiClient();

  const handleSend = async () => {
    if (!account) return;
    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount * 1e9)]);
      tx.transferObjects([coin], recipient);
      const result = await account.signAndExecuteTransaction({ transaction: tx });
      console.log('Tx digest:', result.digest);
    } catch (e) {
      if (e instanceof UserRejectedError) {
        console.log('User rejected');
      } else if (e.message.includes('insufficient gas')) {
        console.log('Insufficient funds');
      }
    }
  };

  return <button onClick={handleSend}>Send {amount} SUI</button>;
}
```


## Advanced Patterns

For context, wrap components in WalletProvider; use `useSuiClientQuery` for queries. Auto-reconnect handles session restore; customize themes via CSS vars. [sdk.mystenlabs](https://sdk.mystenlabs.com/dapp-kit)