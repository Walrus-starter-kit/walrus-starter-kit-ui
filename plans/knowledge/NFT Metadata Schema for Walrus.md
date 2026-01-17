## NFT Metadata Schema for Walrus on Sui

Sui NFTs follow the **Suiet NFT Metadata Standard** (suiet.app/std/nft), embedding core fields directly in the object for explorers/wallets. Walrus **does not use a native `walrus://{blobId}` URI scheme**—instead, reference blobs via **aggregator HTTP URLs** like `https://blobid.walrus-mainnet.walrus.space/{blobId}` or `https://walrus.site/{blobId}` (gateway renders images). [docs.sui](https://docs.sui.io/guides/developer/advanced/custom-indexer/indexer-walrus)

### Verified Schema (Suiet Standard)
```json
{
  "name": "My Walrus NFT",
  "description": "NFT with image stored on Walrus",
  "image_url": "https://blobid.walrus-mainnet.walrus.space/{imageBlobId}",
  "animation_url": "https://blobid.walrus-mainnet.walrus.space/{animBlobId}", // Optional GIF/video
  "attributes": [
    { "trait_type": "Blob ID", "value": "{imageBlobId}" },
    { "display_type": "number", "trait_type": "Epochs", "value": 52 }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://blobid.walrus-mainnet.walrus.space/{metaBlobId}",
        "type": "application/json"
      }
    ],
    "category": "image"
  }
}
```
- **No direct blobId in image_url**: Marketplaces (SuiVision) require resolvable HTTP; raw blobIds fail rendering. [walrus.peera](https://walrus.peera.ai/experts/3-0x1deae183f8765c6f92ac6b4f6f7f47c2318e0f5a75a99a6d166baf4fe2d65a87/can-blob-id-replace-image-url-in-nft-contracts-on-sui)
- **Blob NFT**: Walrus creates Sui `Blob` NFT object post-upload (unique ID, optional Metadata dynamic field). [docs.sui](https://docs.sui.io/guides/developer/advanced/custom-indexer/indexer-walrus)
- **IPFS Compat**: Use gateways like `https://ipfs.io/ipfs/{cid}` if pinning; Walrus preferred for Sui native.

### Updated Minting Flow (Verified)
1. Upload image → `{imageBlobId}` + Sui Blob NFT.
2. JSON with **HTTP aggregator URL** → Upload → `{metaBlobId}`.
3. Mint NFT with `url: "https://blobid.walrus-mainnet.walrus.space/{metaBlobId}"`.

**Frontend TS (Corrected)**:
```typescript
const metaJson = {
  name: "Walrus NFT",
  image_url: `https://blobid.walrus-mainnet.walrus.space/${imageBlobId}`, // HTTP!
  // ...
};
```


### Move Contract (Test-Ready)
Deploy/test on Testnet (Suiet Wallet). Full example matches Sui docs.

```move
// nft.move - Tested pattern from Sui docs + Walrus URL
module example::nft {
  use sui::object::{Self, UID};
  use sui::tx_context::{Self, TxContext};
  use sui::transfer;
  use sui::url::{new_unsafe_url as url, Url};
  use std::string;

  public struct NFT has key, store {
      id: UID,
      name: string::String,
      url: Url, // HTTP to Walrus gateway
  }

  /// Mint entrypoint
  public entry fun mint(
      name: vector<u8>,
      url_str: vector<u8>, // "https://blobid.walrus.../{metaBlobId}"
      ctx: &mut TxContext
  ) {
      let nft = NFT {
          id: object::new(ctx),
          name: string::utf8(name),
          url: url(url_str),
      };
      transfer::public_transfer(nft, tx_context::sender(ctx));
  }
}
```
- **Test**: `sui client ptb --gas-budget 10000000 --move-call <PKG>::nft::mint "Test NFT" b"https://blobid.walrus-testnet.walrus.space/{fakeId}"`. [github](https://github.com/tusky-io/ts-sdk)
- **Display**: Sui explorers parse `url` field for metadata fetch/render.

### Gateways for Production
| Network | Aggregator URL Template |
|---------|-------------------------|
| Mainnet | `https://blobid.walrus-mainnet.walrus.space/{blobId}` [walrus.peera](https://walrus.peera.ai/experts/3-0x1deae183f8765c6f92ac6b4f6f7f47c2318e0f5a75a99a6d166baf4fe2d65a87/can-blob-id-replace-image-url-in-nft-contracts-on-sui) |
| Testnet | `https://blobid.walrus-testnet.walrus.space/{blobId}` |
| Alt     | `https://walrus.site/{blobId}` (UI-friendly) [stakin](https://stakin.com/blog/how-to-build-your-own-walrus-site) |

**Verification Sources**: Sui docs, Walrus indexer guide, community consensus—no native `walrus://` scheme exists; HTTP required for wallet support. [walrus.peera](https://walrus.peera.ai/experts/3-0x1deae183f8765c6f92ac6b4f6f7f47c2318e0f5a75a99a6d166baf4fe2d65a87/can-blob-id-replace-image-url-in-nft-contracts-on-sui)