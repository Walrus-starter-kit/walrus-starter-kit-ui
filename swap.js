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

// Wallet Manager Class
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
      if (wallets.length === 0) throw new Error('No Sui wallet found. Please install Sui Wallet or Slush wallet extension.');
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

    try {
      const balanceData = await suiClient.getBalance({
        owner: this.account.address,
      });

      this.balance = parseInt(balanceData.totalBalance) / 1_000_000_000;
      this.emit('balanceUpdated', { balance: this.balance });
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
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

const walletManager = new WalletManager();

// Log available wallets on load
try {
  const wallets = walletManager.getSuiWallets();
  console.log('Available Sui wallets:', wallets.length);
  wallets.forEach(w => console.log('- ' + w.name));
} catch (e) {
  console.log('Wallet detection:', e.message);
}

// UI Elements
const elements = {
  swapAmount: null,
  balanceValue: null,
  maxBtn: null,
  swapBtn: null,
  insufficientMsg: null,
  connectMsg: null,
  connectBtn: null,
  disconnectBtn: null,
  walletInfo: null,
  walletAddress: null,
};

function initElements() {
  elements.swapAmount = document.getElementById('swap-amount');
  elements.balanceValue = document.getElementById('balance-value');
  elements.maxBtn = document.getElementById('max-btn');
  elements.swapBtn = document.getElementById('swap-btn');
  elements.insufficientMsg = document.getElementById('insufficient-balance-msg');
  elements.connectMsg = document.getElementById('connect-wallet-msg');
  elements.connectBtn = document.getElementById('connect-wallet-btn');
  elements.disconnectBtn = document.getElementById('disconnect-btn');
  elements.walletInfo = document.getElementById('wallet-info');
  elements.walletAddress = document.getElementById('wallet-address');
}

function updateSwapUI() {
  const { swapAmount, balanceValue, swapBtn, insufficientMsg, connectMsg } = elements;

  if (!walletManager.connected) {
    if (balanceValue) balanceValue.textContent = '--';
    if (swapBtn) {
      swapBtn.disabled = true;
      swapBtn.textContent = 'Connect Wallet to Swap';
    }
    insufficientMsg?.classList.add('hidden');
    connectMsg?.classList.remove('hidden');
    return;
  }

  // Update balance
  if (balanceValue) balanceValue.textContent = walletManager.balance.toFixed(4);
  connectMsg?.classList.add('hidden');

  // Validate amount
  const amount = parseFloat(swapAmount?.value) || 0;
  const hasInsufficientBalance = amount > walletManager.balance;

  if (hasInsufficientBalance) {
    insufficientMsg?.classList.remove('hidden');
    if (swapBtn) {
      swapBtn.disabled = true;
      swapBtn.textContent = 'Insufficient Balance';
    }
  } else if (amount <= 0) {
    insufficientMsg?.classList.add('hidden');
    if (swapBtn) {
      swapBtn.disabled = true;
      swapBtn.textContent = 'Enter Amount';
    }
  } else {
    insufficientMsg?.classList.add('hidden');
    if (swapBtn) {
      swapBtn.disabled = false;
      swapBtn.textContent = 'Swap to WAL';
    }
  }
}

function handleMaxClick() {
  if (!walletManager.connected || !elements.swapAmount) return;

  const gasReserve = 0.05;
  const maxAmount = Math.max(0, walletManager.balance - gasReserve);
  elements.swapAmount.value = maxAmount.toFixed(4);
  updateSwapUI();
}

// Swap Transaction Functions
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

  const amountStr = elements.swapAmount?.value || '0';
  const amount = parseFloat(amountStr);

  // Validate input format (reject scientific notation, negative, NaN)
  if (!amountStr.match(/^\d+(\.\d+)?$/) || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount (e.g., 1.5)');
    return;
  }

  if (amount > walletManager.balance) {
    alert('Insufficient balance');
    return;
  }

  // Update UI to loading state
  const swapBtn = elements.swapBtn;
  if (!swapBtn) return;

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
    if (elements.swapAmount) elements.swapAmount.value = '';
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

  // Validate digest format (base58 or hex)
  const sanitizedDigest = escapeHtml(digest || '');

  toast.innerHTML = `
    <span class="material-symbols-outlined">check_circle</span>
    <div>
      <p class="font-bold">Swap Successful!</p>
      <a href="https://suiscan.xyz/testnet/tx/${sanitizedDigest}" target="_blank" class="text-xs underline hover:no-underline">
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initElements();

  let isConnecting = false; // Debounce flag

  // Wallet connection events
  elements.connectBtn?.addEventListener('click', async () => {
    if (isConnecting) return; // Prevent multiple clicks

    try {
      isConnecting = true;
      elements.connectBtn.disabled = true;
      elements.connectBtn.textContent = 'Connecting...';
      await walletManager.connect();
    } catch (err) {
      console.error('Failed to connect:', err);
      alert('Failed to connect: ' + err.message);
    } finally {
      isConnecting = false;
      if (elements.connectBtn) {
        elements.connectBtn.disabled = false;
        elements.connectBtn.textContent = 'Connect Wallet';
      }
    }
  });

  elements.disconnectBtn?.addEventListener('click', async () => {
    await walletManager.disconnect();
  });

  walletManager.on('connected', ({ account }) => {
    elements.connectBtn?.classList.add('hidden');
    elements.walletInfo?.classList.remove('hidden');
    elements.walletInfo?.classList.add('flex');
    if (elements.walletAddress) {
      elements.walletAddress.textContent = walletManager.getAddressShort();
    }
    updateSwapUI();
  });

  walletManager.on('disconnected', () => {
    elements.connectBtn?.classList.remove('hidden');
    elements.walletInfo?.classList.add('hidden');
    elements.walletInfo?.classList.remove('flex');
    updateSwapUI();
  });

  walletManager.on('balanceUpdated', updateSwapUI);

  // Swap UI events
  elements.swapAmount?.addEventListener('input', updateSwapUI);
  elements.maxBtn?.addEventListener('click', handleMaxClick);
  elements.swapBtn?.addEventListener('click', executeSwap);

  // Initial UI update
  updateSwapUI();
});
