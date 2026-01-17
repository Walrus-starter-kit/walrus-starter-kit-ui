Walrus operates on Mainnet (live since March 2025 with 100+ nodes), Testnet, and Devnet, using decentralized aggregators for reads and publishers for writes. Production favors Mainnet with multiple public endpoints for redundancy; self-hosting recommended for high-volume use. Costs involve WAL/SUI for storage epochs, no fixed quotas but publisher limits apply. [docs.wal](https://docs.wal.app/docs/usage/web-api)

## Environment Endpoints

Use these public URLs; SDK auto-configures Testnet, override for others.

| Network | Aggregator (Read)  [docs.wal](https://docs.wal.app/docs/usage/web-api) | Publisher (Write)  [docs.wal](https://docs.wal.app/docs/usage/web-api) | Notes |
|---------|--------------------------------------------|------------------------------------|-------|
| Mainnet | aggregator.walrus-mainnet.walrus.space<br>mainnet-walrus-aggregator.kiliglab.io<br>mainnet-aggregator.walrus.graphyte.dev<br>walrus-aggregator.stakin-nodes.com<br>walrus-aggregator-mainnet.chainode.tech<br>walrus-mainnet-aggregator.stakecraft.com<br>walrus-cache-mainnet.latitude.sh<br>walrus.prostaking.com | Run self-hosted or relays; no central public listed  [docs.wal](https://docs.wal.app/blog/06_mainnet.html) | 100+ nodes; global regions (APAC/EU/US/LATAM); WALCDN routes optimally  [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus) |
| Testnet | aggregator.walrus-testnet.walrus.space  [docs.wal](https://docs.wal.app/docs/usage/web-api) | publisher.walrus-testnet.walrus.space  [docs.wal](https://docs.wal.app/docs/usage/web-api) | SDK defaults  [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus) |
| Devnet  | aggregator-devnet.walrus.space<br>publisher-devnet.walrus.space  [github](https://github.com/Mr-Sunglasses/walrus-mcp) | As above  [github](https://github.com/Mr-Sunglasses/walrus-mcp) | System object: 0x37c0e4d7b36a2f64d51bba262a1791f844cfd88f19c35b5ca709e1a6991e90dc  [github](https://github.com/Mr-Sunglasses/walrus-mcp) |

## Rate Limits & Quotas

Public publishers enforce defaults; self-host to customize. [walrus.peera](https://walrus.peera.ai/es/experts/3-0x230af8f15641f3cd3b3bd801edd5a607ab025ae88c3ff32e8f14b7dc9fb18d91/how-to-upload-large-files-to-walrus-without-speed-issues)

- **Blob Size**: Max ~13.6 GiB per blob. [walrus.peera](https://walrus.peera.ai/es/experts/3-0x230af8f15641f3cd3b3bd801edd5a607ab025ae88c3ff32e8f14b7dc9fb18d91/how-to-upload-large-files-to-walrus-without-speed-issues)
- **HTTP Upload**: Default 10 MiB (--max-body-size); quilts 100 MiB (--max-quilt-body-size). [walrus.peera](https://walrus.peera.ai/es/experts/3-0x230af8f15641f3cd3b3bd801edd5a607ab025ae88c3ff32e8f14b7dc9fb18d91/how-to-upload-large-files-to-walrus-without-speed-issues)
- **Concurrency**: Tune --n-clients, --max-concurrent-requests (default low). [walrus.peera](https://walrus.peera.ai/es/experts/3-0x230af8f15641f3cd3b3bd801edd5a607ab025ae88c3ff32e8f14b7dc9fb18d91/how-to-upload-large-files-to-walrus-without-speed-issues)
- **No Hard Rates**: Throttling via public aggregator/publisher policies; auth/JWT for Mainnet publishers. [docs.wal](https://docs.wal.app/blog/06_mainnet.html)
- **Costs**: WAL for storage epochs (stake-voted pricing), SUI gas; prepay per epoch. [insights.blockbase](https://insights.blockbase.co/walrus-protocol-a-comprehensive-overview/)

## Stability & Best Practices

Mainnet offers production-grade decentralization with no formal uptime SLA, but 100+ nodes ensure redundancy. Use multiple aggregators (e.g., WalrusCDN auto-routes by latency/region); fallback via SDK retries. Self-run daemon/publisher for control (health endpoint available); monitor metrics/logs. [docs.wal](https://docs.wal.app/docs/operator-guide/aggregator)