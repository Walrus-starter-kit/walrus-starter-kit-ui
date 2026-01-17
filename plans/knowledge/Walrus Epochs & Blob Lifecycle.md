Walrus blobs are stored for a prepaid number of epochs via WAL tokens, with Mainnet epochs lasting ~2 weeks (Testnet shorter, e.g., 2 days). Expiration frees resources automatically; deletable blobs allow early owner deletion, while non-deletable ensure full duration availability. Renewal via Sui tx updates storage resources, enabling indefinite storage through automation. [walrus](https://www.walrus.xyz/network-release-schedule)

## Epochs Overview

Sui epochs (~24h Devnet/Testnet, ~90 days Mainnet adjusted for Walrus ~2 weeks Mainnet) define storage contracts. Max upfront: ~2 years (104 Mainnet epochs). Costs: Stake-voted WAL price (e.g., ~1.3 WAL/1GiB/epoch via calculator); fixed per contract, trends downward. [tusky](https://tusky.io/blog/does-walrus-offer-permanent-storage)

## Blob Lifecycle

1. **Write**: Acquire storage resource on Sui, encode/upload slivers, certify PoA. [github](https://github.com/tusky-io/ts-sdk)
2. **Store**: Nodes hold slivers (RedStuff erasure coding); quorum reads/writes ensure resilience.
3. **Expire**: At epoch end, blob unavailable; storage rebate on Sui object burn (non-deletion). [docs.wal](https://docs.wal.app/docs/dev-guide/costs)
4. **Delete**: Deletable blobs: Owner disassociates via tx (reuse space); non-deletable: No early delete. [tusky](https://tusky.io/blog/does-walrus-offer-permanent-storage)
5. **GC**: Automatic on expiration/deletion; no manual GC needed.

Permanence: Contractual till expiry; 1/3 node failure tolerance. [luganodes](https://www.luganodes.com/blog/walrus-decentralized-storage/)

## Renewal Mechanisms

Submit Sui tx to extend storage resource (add epochs, up to max). Automate via Move contracts for perpetual storage (pre-fund). [walrus](https://www.walrus.xyz/blog/how-walrus-blob-storage-works)

## Recommendations

| Use Case              | Epochs (Mainnet) | Duration (~2wk/epoch) | Notes |
|-----------------------|------------------|-----------------------|-------|
| Short-lived (cache)  | 1-4             | 2-8 weeks            | Deletable, low cost  [tusky](https://tusky.io/blog/does-walrus-offer-permanent-storage) |
| Medium (assets)      | 26              | 1 year               | Non-deletable |
| Long-term (archive)  | 52-104          | 2 years max upfront  | Auto-renew contracts  [walrus](https://www.walrus.xyz/blog/how-walrus-blob-storage-works) |
| Permanent            | Indefinite      | Perpetual            | Smart contract automation  [tusky](https://tusky.io/blog/does-walrus-offer-permanent-storage) |

## Best Practices

- **Optimization**: Batch files into quilts; use relays for uploads; prepay max for cost locks. [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus)
- **Short vs Long**: Short: deletable for flexibility; long: non-deletable for proofs.
- **Monitoring**: Query Sui object for expiry; use SDK `getBlobInfo` or explorers; alert pre-expiry. [docs.wal](https://docs.wal.app/docs/design/operations-sui)
- **Costs**: Check https://costcalculator.wal.app; trade storage resources secondary market. [costcalculator.wal](https://costcalculator.wal.app)