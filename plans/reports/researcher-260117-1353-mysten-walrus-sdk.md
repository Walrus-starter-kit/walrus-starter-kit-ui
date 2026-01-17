# @mysten/walrus SDK Implementation Guide

## 1. Core APIs

Primary interaction is via `WalrusClient`.

```typescript
import { WalrusClient } from '@mysten/walrus';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

// Initialization
const walrus = new WalrusClient({
  network: 'testnet', // or 'mainnet'
  suiClient: new SuiClient({ url: getFullnodeUrl('testnet') }),
});
```

### Store (Upload)

Two modes available:

1. **Relay (Recommended for Clients):** Offloads Erasure Encoding/encryption to a relay node.
   ```typescript
   // Returns: { blobId: string, ... }
   const result = await walrus.writeBlobToUploadRelay(dataUInt8Array, {
     nEpochs: 1,
   });
   ```
2. **Direct (Node.js/Heavy):** Client performs encoding.
   ```typescript
   const result = await walrus.writeBlob(dataUInt8Array);
   ```

### Retrieve (Download)

```typescript
// Returns: Uint8Array
const data = await walrus.readBlob(blobId);
```

### Metadata

```typescript
// Returns: { blobId, size, encodingType, ... }
const metadata = await walrus.getBlobMetadata(blobId);
```

## 2. Integration Requirements

- **Dependencies:** `@mysten/walrus` (v0.6.7+), `@mysten/sui` (peer).
- **Authentication:**
  - `WalrusClient` generally uses `SuiClient` for read-only chain data.
  - **Writes (Registration):** Operations like `registerBlob` require a signed transaction.
    - Pattern: Generate transaction -> Sign with Wallet -> Execute.
    - `const tx = await walrus.registerBlobTransaction({ blobId, ... });`
    - `wallet.signAndExecuteTransactionBlock({ transactionBlock: tx });`
- **Network:** `testnet` is the stable target. Mainnet requires custom config or waiting for full launch availability.

## 3. Adapter Interface Design

For the CLI template generator, abstract Walrus behind this interface:

```typescript
interface StorageAdapter {
  upload(file: File | Uint8Array): Promise<string>; // Returns Blob ID
  download(blobId: string): Promise<Uint8Array>;
  getMetadata(blobId: string): Promise<BlobMetadata>;
}
```

## 4. Use Case Patterns

### Simple Gallery Upload (Browser)

Use **Upload Relay** to avoid heavy client-side processing and CORS issues.

```typescript
async function uploadToGallery(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { blobId } = await walrus.writeBlobToUploadRelay(bytes);
  return blobId; // Store this ID in your app's object/database
}
```

### NFT/Metadata Storage

1. Upload image -> Get `imageBlobId`.
2. Upload JSON metadata containing `imageBlobId` -> Get `metaBlobId`.
3. Mint NFT on Sui with `metaBlobId` as the asset URL/pointer.

## 5. Key Insights

1. **Relay is King:** For almost all UI/Client templates, use `writeBlobToUploadRelay`. Direct `writeBlob` is too heavy for browsers.
2. **Tx Pattern:** Mutating Walrus state (registering blobs) follows standard Sui Transaction Block patterns (Build -> Sign -> Execute).
3. **Blob ID is Key:** The Blob ID is the permanent reference. It is _not_ a URL. Retrieve via SDK or public HTTP gateways (`https://aggregator.walrus-testnet.walrus.space/v1/{blobId}`).
4. **Environment:** Requires specific `systemObjectId` and `stakingPoolId` if not using default Testnet presets (e.g., local devnet).

## Sources

- npm: [@mysten/walrus](https://www.npmjs.com/package/@mysten/walrus)
- Docs: [Sui TypeScript SDK - Walrus](https://sdk.mystenlabs.com/walrus)
- Examples: [Walrus Docs](https://docs.wal.app/usage/examples)
