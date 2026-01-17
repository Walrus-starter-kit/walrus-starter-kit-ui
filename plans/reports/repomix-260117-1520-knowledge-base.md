This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
Bundle Size Optimization.md
Cross-Platform Path Handling.md
Deep Merge Strategies for package.json.md
E2E Testing Strategy.md
File Gallery UX Patterns.md
Multi-SDK API Comparison.md
Network Endpoints & Configuration.md
NFT Metadata Schema for Walrus.md
React Hooks Patterns for Walrus.md
Sui Wallet Integration Patterns.md
```

# Files

## File: Bundle Size Optimization.md
````markdown
Vite enables tree-shaking for ESM packages like @mysten/walrus (use named imports e.g., { WalrusClient } to minimize); analyze with rollup-plugin-visualizer. Code split routes/components dynamically, lazy-load SDK on upload/download pages. Target gzipped totals: <100KB vendor, <50KB main, <200KB total interactive. [developerway](https://www.developerway.com/posts/bundle-size-investigation)

## Optimization Checklist

### SDK Tree-Shaking
- ✅ Named imports: `import { WalrusClient } from '@mysten/walrus'` (no barrel `import *`). [developerway](https://www.developerway.com/posts/bundle-size-investigation)
- ✅ Dynamic SDK: `const { WalrusClient } = await import('@mysten/walrus')` in upload modal.
- ✅ Analyzer: Add to vite.config.ts:
  ```typescript
  import { visualizer } from 'rollup-plugin-visualizer';
  plugins: [visualizer({ filename: './dist/report.html', gzipSize: true })]
  ```
  Run `vite build --mode production` → open report.html [dev](https://dev.to/werliton/analise-seu-app-como-um-heroi-benchmarking-com-vite-rollup-em-projetos-react-ak)

### Code Splitting
- ✅ Routes: `const UploadPage = lazy(() => import('./UploadPage'))` [github](https://github.com/vitejs/vite/discussions/17730)
- ✅ Components: Lazy heavy charts/galleries.
- ✅ manualChunks in vite.config.ts:
  ```typescript
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          sui: ['@mysten/sui', '@mysten/walrus'], // ~150KB split
          vendor: ['react', 'react-dom'],
        },
      },
    },
  }
  ```
  Results: main.[hash].js <50KB, sui.[hash].js ~120KB gzipped [mykolaaleksandrov](https://www.mykolaaleksandrov.dev/posts/2025/10/react-lazy-suspense-vite-manualchunks/)

### Monitoring & CI
- ✅ vite-plugin-bundlesize: Enforce limits.
  ```typescript
  // vite.config.ts
  import bundlesize from 'vite-plugin-bundlesize';
  plugins: [bundlesize({
    limits: [
      { name: 'assets/index-*.js', limit: '50 kB' },
      { name: 'assets/*', limit: '200 kB' },
    ],
  })]
  ```
  Fail build if exceeded [npmjs](https://npmjs.com/package/vite-plugin-bundlesize)
- ✅ Bundlewatch CI: `npx bundlewatch --github-pull-request` (diff PR sizes).
- ✅ Targets:
  | Chunk       | Gzipped Target |
  |-------------|----------------|
  | main       | <50KB         |
  | vendor     | <100KB        |
  | sui/walrus | <150KB        |
  | Total LCP  | <200KB        |

## vite.config.ts Snippet

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import bundlesize from 'vite-plugin-bundlesize';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, gzipSize: true }),
    bundlesize({
      limits: [{ name: '**/*', limit: '300 kB' }],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@mysten/walrus') || id.includes('@mysten/sui')) return 'sui';
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
  },
});
```
Run `vite build && vite-bundle-analyzer` for viz [npmjs](https://www.npmjs.com/package/vite-bundle-analyzer)

## Verification Commands

- `npm run analyze` → View treemap.
- Lighthouse: Aim PS75+ (bundle <170KB median).
- Bundlephobia: Check deps individually. [frontendjoy](https://www.frontendjoy.com/p/how-i-reduced-my-react-bundle-size-by-30-with-real-examples)
````

## File: Cross-Platform Path Handling.md
````markdown
Node.js `path` module handles cross-platform paths automatically, using `/` on Unix/macOS and `\` on Windows. Always prefer `path.join()` and `path.resolve()` over string concatenation to avoid separator issues and traversal vulnerabilities. Validation prevents security risks like path traversal via `../` or Windows device names (e.g., CON). [stackoverflow](https://stackoverflow.com/questions/66042298/how-to-correctly-create-cross-platform-paths-with-nodejs)

## Windows-Specific Handling

Windows paths start with drive letters (C:\), use `\` separators, and hit 260-char MAX_PATH limit (use `\\?\` prefix or enable LongPathsEnabled registry). PowerShell/CMD handle native formats; WSL uses Unix-style but maps Windows drives (/mnt/c/). CLI tools must resolve relative paths with `path.resolve()` to get absolute, normalized forms. [github](https://github.com/ehmicky/cross-platform-node-guide/blob/main/docs/3_filesystem/file_paths.md)

## Node.js Path API Usage

- **path.join(...parts)**: Joins with platform separator, ignores non-strings (e.g., `path.join('foo', 'bar')` → 'foo/bar' Unix, 'foo\\bar' Windows). [nodejs](https://nodejs.org/api/path.html)
- **path.resolve([from...], to)**: Makes absolute from cwd/from dirs (e.g., `path.resolve('..', 'file.txt')` resolves like `cd ..; cd file.txt; pwd`). [shapeshed](https://shapeshed.com/writing-cross-platform-node/)
- **path.normalize(p)**: Collapses `..`/`./` but doesn't resolve to absolute (use after join for cleaning). [millermedeiros.github](https://millermedeiros.github.io/mdoc/examples/node_api/doc/path.html)
- **Validation**: Check `path.isAbsolute()`; regex for safe paths: `^(?!.*[<>:"/\\|?*]|(?:^|[/\\])(\.\.|CON|PRN|AUX|NUL|COM\d+|LPT\d+)[/\\]?)[a-zA-Z0-9_./\\\-]+$` (blocks traversal, devices, invalid chars). [zeropath](https://zeropath.com/blog/cve-2025-27210-nodejs-path-traversal-windows)

## Testing Strategies

Test via CI matrix (GitHub Actions: ubuntu-latest/windows-latest/macos-latest) with vitest/jest spawning processes. Mock `process.platform` or use `path.win32`/`path.posix` for portable tests; verify with `fs.existsSync(resolvedPath)`. Pitfalls: unnormalized inputs, device name bypasses, long paths (>260 chars without prefix). [github](https://github.com/ehmicky/cross-platform-node-guide/blob/main/docs/3_filesystem/file_paths.md)

## Code Examples

```javascript
const path = require('node:path');
const fs = require('node:fs');

// Safe join/resolve
const safePath = path.resolve(path.join(baseDir, userInput));

// Validate before use
function validatePath(input) {
  const normalized = path.normalize(input);
  if (!path.isAbsolute(normalized) || /[<>"|?*\x00-\x1f]/.test(normalized) ||
      /^(?:CON|PRN|AUX|NUL|COM\d+|LPT\d+)/i.test(normalized.replace(/\\/g, '/'))) {
    throw new Error('Invalid path');
  }
  return normalized;
}
```

**Test Cases** (use in CI):

| Input                  | Platform | Expected Output (resolve from /home/test) | Valid? |
|------------------------|----------|-------------------------------------------|--------|
| '../foo/bar.txt'      | Unix    | /home/foo/bar.txt                        | Yes   |
| '..\\foo\\bar.txt'    | Windows | C:\foo\bar.txt (from C:\home\test)       | Yes   |
| 'CON\\..\\etc\\passwd'| Windows | Invalid (blocked)                        | No    |
| '/very/long/path...'  | Windows | \\?\C:\very\long... (260+ chars)         | Check len |
| './../..'             | All     | / (root)                                 | Yes   |  [stackoverflow](https://stackoverflow.com/questions/66042298/how-to-correctly-create-cross-platform-paths-with-nodejs)
````

## File: Deep Merge Strategies for package.json.md
````markdown
Research robust package.json deep merge strategies for CLI scaffolding:

1. Existing solutions:
   - lodash.merge vs deepmerge library
   - Custom implementations (create-next-app, create-vite)
   - Pros/cons of each approach

2. Conflict resolution:
   - Dependency version conflicts (^1.0.0 vs ^2.0.0)
   - Script name collisions
   - Config field merging (engines, browserslist)

3. Edge cases:
   - Nested object merging
   - Array handling (replace vs concat)
   - Peer dependency warnings

Output: Recommended merge algorithm with implementation examples.

Work context: d:\Sui\walrus-starter-kit
Reports: d:\Sui\walrus-starter-kit\plans\reports\
Web Search Prompts:


"package.json deep merge cli scaffolding"
"create-next-app package.json merge strategy"
"lodash merge vs deepmerge npm"
"dependency version conflict resolution"
````

## File: E2E Testing Strategy.md
````markdown
E2E testing for CLI scaffolders uses Jest with mock-fs for filesystem isolation, inquirer mocking for prompts, and snapshots for generated code diffs. Verify projects by running npm install/build/test/lint in temp dirs. GitHub Actions matrix ensures cross-OS compatibility. [stackoverflow](https://stackoverflow.com/questions/58413428/jest-mocking-and-testing-the-node-js-filesystem)

## Testing Frameworks

- **Jest**: Snapshots compare generated dirs/files; `--updateSnapshot` for regen.
- **Prompt Mocking**: `jest.mock('inquirer')`; mock stdin/stdout.
- **FS Mocking**: mock-fs simulates dir structure; restore post-test. [github](https://github.com/tschaub/mock-fs)

**CLI Test Example**:
```typescript
// cli.test.ts
import { execSync } from 'child_process';
import mock from 'mock-fs';
import path from 'path';
import fs from 'fs';

jest.mock('inquirer', () => ({
  prompt: () => Promise.resolve({ projectName: 'test-app', features: ['walrus'] }),
}));

describe('CLI scaffolding', () => {
  const projectDir = './generated-app';

  beforeEach(() => {
    mock({}); // Clean FS
  });

  afterEach(() => mock.restore());

  it('generates Walrus starter kit', async () => {
    execSync('node bin/cli.js init test-app --features walrus', { cwd: './', stdio: 'pipe' });
    const files = fs.readdirSync(projectDir);
    expect(files).toContain('package.json');
    expect(fs.readFileSync(path.join(projectDir, 'vite.config.ts'), 'utf8')).toMatchSnapshot();
  });
});
```

## Generated Project Verification

Spawn subprocesses in generated dir:

```typescript
// verifyProject.ts
import { execSync } from 'child_process';
import path from 'path';

function verifyProject(dir: string) {
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  expect(pkg.dependencies['@mysten/walrus']).toBeDefined();

  execSync('npm install', { cwd: dir });
  execSync('npm run build', { cwd: dir, timeout: 30000 }); // Build check
  execSync('npm run lint', { cwd: dir }); // ESLint
  execSync('tsc --noEmit', { cwd: dir }); // Type check
  execSync('npm test', { cwd: dir }); // Units
}
```


## CI/CD Configuration

GitHub Actions matrix for OS/Node; test multiple templates.

```yaml
# .github/workflows/e2e.yml
name: E2E CLI Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-14]
        node: [18, 20, 22]
        include:
          - os: ubuntu-latest
            template: walrus-basic
          - os: windows-latest
            template: walrus-nft
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test:e2e # jest --runInBand (serial for FS)
        env:
          CI: true
      - name: Performance Benchmark
        run: |
          npm run bench:scaffold # Time init
        if: matrix.os == 'ubuntu-latest'
```
Matrix parallelizes (3 OS x 3 Node x 2 templates); use artifacts for failed dirs. [blacksmith](https://www.blacksmith.sh/blog/matrix-builds-with-github-actions)

## Best Practices

- Run serially (`--runInBand`) for FS conflicts.
- Update snapshots selectively.
- Mock global deps (e.g., npm exec).
- Benchmark scaffold time <5s.
- Separate smoke tests for quick CI feedback. [jestjs](https://jestjs.io/docs/snapshot-testing)
````

## File: File Gallery UX Patterns.md
````markdown
File galleries persist metadata (blobId, thumbnailUrl, name, size, uploadDate) in IndexedDB for large blobs/binary data, syncing via Walrus/Sui onchain for ownership. Use react-window for virtual scrolling, Canvas API for thumbnails, and react-dropzone for drag-drop. Infinite scroll outperforms pagination for galleries; optimize with WebP/AVIF via browser APIs. [github](https://github.com/bvaughn/react-window)

## Persistence Schema

IndexedDB stores blobs efficiently (~50% disk); LocalStorage limited to strings (~5MB).

| Storage     | Pros                          | Cons                       | Use Case                  |
|-------------|-------------------------------|----------------------------|---------------------------|
| IndexedDB  | Async, blobs/objects, indexed | Complex API               | Metadata + thumbnails  [dev](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5) |
| LocalStorage | Sync, simple                 | Strings only, small quota | User prefs (view/sort)  [dev](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5) |

**Schema Example** (idb-keyval or Dexie.js):
```javascript
// Schema: { blobs: [{ id: 'blobId', name: 'file.jpg', thumbnail: blobUrl, size: 1024, date: Date.now(), tags: [] }] }
```

Sync: Poll Sui object or use RPC subscriptions for updates. [dev](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5)

## Performance Techniques

- **Virtual Scrolling**: react-window/VirtualList for 10k+ items (render viewport only). [web](https://web.dev/articles/virtualize-long-lists-react-window)
- **Thumbnails**: Canvas resize (100x100px) on upload; store as blob URL. [youtube](https://www.youtube.com/watch?v=5Vro146pDa0)
- **Lazy Loading**: `loading="lazy"` + IntersectionObserver; use react-intersection-observer. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-build-an-infinite-scroll-image-gallery-with-react-css-grid-and-unsplash)
- **Optimization**: Canvas toBlob('image/webp'); compress via browser-image-resizer.

**Thumbnail Gen**:
```typescript
function generateThumbnail(file: File): Promise<string> {
  return new Promise((res) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 200, 200);
      canvas.toBlob((blob) => res(URL.createObjectURL(blob!)), 'image/webp');
    };
    img.src = URL.createObjectURL(file);
  });
}
```

## UX Patterns & Libraries

- **Views**: Masonry grid (react-masonry-css) > list; toggle via state.
- **Scroll**: Infinite (react-infinite-scroll-component) with IntersectionObserver. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-build-an-infinite-scroll-image-gallery-with-react-css-grid-and-unsplash)
- **Search/Filter**: Fuse.js on metadata.
- **Drag-Drop**: react-dropzone.

**Library Recs**:
| Category       | Libs                          | Why |
|----------------|-------------------------------|-----|
| Virtual List  | react-window, virtua         | High perf  [github](https://github.com/bvaughn/react-window) |
| Infinite Scroll | react-infinite-scroll-component | Easy Unsplash-like  [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-build-an-infinite-scroll-image-gallery-with-react-css-grid-and-unsplash) |
| Gallery UI    | react-image-gallery, lightGallery | Thumbs/zoom  [github](https://github.com/brillout/awesome-react-components) |
| Drop Upload   | react-dropzone               | Drag-drop |
| IndexedDB     | Dexie.js, idb-keyval         | Typed schema  [dev](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5) |

**Gallery Example** (react-window + infinite):
```typescript
import { FixedSizeGrid as Grid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useInfiniteQuery } from '@tanstack/react-query';

function Gallery({ items }) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({ /* Walrus list query */ });
  const itemCount = data?.pages.reduce((acc, page) => acc + page.blobs.length, 0) ?? 0;

  return (
    <InfiniteLoader isItemLoaded={() => true} itemCount={itemCount} loadMoreItems={fetchNextPage} />
    {({ onItemsRendered, ref }) => (
      <Grid columnCount={4} columnWidth={250} height={800} rowCount={Math.ceil(itemCount/4)} rowHeight={250} ref={ref} onItemsRendered={onItemsRendered}>
        {({ columnIndex, rowIndex, style }) => {
          const idx = rowIndex * 4 + columnIndex;
          const item = data.pages.flatMap(p => p.blobs)[idx];
          return <div style={style}><img src={item.thumbnail} loading="lazy" /></div>;
        }}
      </Grid>
    )}
  );
}
```
````

## File: Multi-SDK API Comparison.md
````markdown
The Walrus SDKs differ significantly in design, with @mysten/walrus as the low-level official library for direct blob/quilt operations on Sui testnet/mainnet, while @tusky-io/ts-sdk and @hibernuts/walrus-sdk provide higher-level file system abstractions (Tusky adds E2E encryption and vaults; Hibernuts adds folders/collaboration). No direct comparisons exist, but npm data shows low adoption for alternatives. [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus)

## Compatibility Matrix

| Feature/Method          | @mysten/walrus (Official)  [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus) | @tusky-io/ts-sdk  [github](https://github.com/tusky-io/ts-sdk) | @hibernuts/walrus-sdk  [npmjs](https://www.npmjs.com/package/@hibernuts/walrus-sdk) |
|-------------------------|-----------------------------------------------------|----------------------------------|---------------------------------------|
| Upload (files/blobs)   | `writeFiles(files[], epochs, signer)` or `writeBlob(blob, epochs, signer)`; supports WalrusFile from Uint8Array/Blob/string; browser flow via `writeFilesFlow()` (encode/register/upload/certify)  [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus) | `file.upload(vaultId, path)` (returns uploadId); vault.create() first; supports File-like  [github](https://github.com/tusky-io/ts-sdk) | `uploadFile(file: File, filepath)` or `storeBlob(data: string/Buffer, epochs)`  [npmjs](https://www.npmjs.com/package/@hibernuts/walrus-sdk) |
| Download (files/blobs) | `getFiles(ids[])` → WalrusFile (bytes/text/json); `readBlob(blobId)` → Uint8Array  [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus) | `file.arrayBuffer/get(uploadId)` → buffer/metadata; `file.listAll()`  [github](https://github.com/tusky-io/ts-sdk) | `getBlob(blobId)` → Buffer  [npmjs](https://www.npmjs.com/package/@hibernuts/walrus-sdk) |
| List/Directory         | Via `blob.files({identifiers/tags/ids})` on quilts  [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus) | `file.listAll()`; vault-based  [github](https://github.com/tusky-io/ts-sdk) | `getFolderContents(folderId)`; `getAllUserFiles()`; `getTreeStructure(path)`  [npmjs](https://www.npmjs.com/package/@hibernuts/walrus-sdk) |
| Delete/Deletable       | `deletable: true` param on write  [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus) | Not exposed in core API  [github](https://github.com/tusky-io/ts-sdk) | `deleteNode(id)`  [npmjs](https://www.npmjs.com/package/@hibernuts/walrus-sdk) |

## Authentication Patterns

@mysten/walrus requires Sui signer (e.g., keypair/Ed25519Keypair) for on-chain txns (SUI/WAL fees); optional uploadRelay with tip. @tusky-io/ts-sdk uses API key, Sui wallet (signPersonalMessage + account), or keypair with `auth.signIn()`; password/self-hosted keys for encryption. @hibernuts/walrus-sdk initializes with aggregator/publisher/apiUrl (no explicit auth shown; likely backend-dependent). [github](https://github.com/tusky-io/ts-sdk)

## Environment Support

All support TypeScript and Node.js (requires SuiClient for official); browser needs special handling. @mysten/walrus: WASM config for Vite/Next.js, browser popup flows. @tusky-io/ts-sdk: Separate `/web` import; Sui dapp-kit integration. @hibernuts/walrus-sdk: File/Buffer support implies browser/Node. [docs.tusky](https://docs.tusky.io/http-api)

## Other Aspects

- **TS Quality**: All TypeScript-native; official has full TypeDocs. Alternatives under active dev (Tusky: 194 releases to May 2025; disclaimer on audits/changes). [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus)
- **Bundle Sizes**: Not specified; official includes WASM (~heavy for direct node interaction). [sdk.mystenlabs](https://sdk.mystenlabs.com/walrus)
- **Installation**: `npm i @mysten/walrus @mysten/sui`; `npm i @tusky-io/ts-sdk`; `npm i @hibernuts/walrus-sdk`. [docs.tusky](https://docs.tusky.io/http-api)
- **Breaking Changes**: Official stable; Tusky frequent (194 releases, API iteration warning); Hibernuts v1.0.1 (9mo old). [npmjs](https://www.npmjs.com/package/@hibernuts/walrus-sdk)
- **Adoption**: Official tied to Mysten/Sui ecosystem (high indirect use); alternatives low/no dependents, few GitHub stars (Tusky:18), no weekly download stats available. [github](https://github.com/tusky-io/ts-sdk)
````

## File: Network Endpoints & Configuration.md
````markdown
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
````

## File: NFT Metadata Schema for Walrus.md
````markdown
Sui NFTs embed metadata directly in objects (name, description, url fields) following Suiet standard, with Walrus blobIds referenced as "walrus://{blobId}?tags=..." or HTTP gateways like walrus.site/{blobId}. No native IPFS support, but HTTP/IPFS gateways render images in wallets/explorers. Minting uploads assets to Walrus, stores JSON metadata as blob, then creates owned NFT object linking to it. [std.suiet](https://std.suiet.app/nft/)

## Minting Flow

1. **Upload Image**: Walrus → imageBlobId.
2. **Metadata JSON**: `{name, description, image: "walrus://{imageBlobId}", attributes: [...]} → metaBlobId`.
3. **Mint NFT**: Move tx creates NFT object with url: metaBlobId (wallets fetch/parse). [docs.sui](https://docs.sui.io/guides/developer/advanced/custom-indexer/indexer-walrus)

## Frontend Code (React + @mysten/walrus)

```typescript
// MintNFT.tsx
import { useWalrusUpload } from './useWalrus'; // From prior hooks
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'; // Or wallet signer

async function mintNFT(imageFile: File, metadata: {name: string; description: string; attributes: string[][]}) {
  const account = useCurrentAccount()!;
  const { upload } = useWalrusUpload(52); // 1yr
  const client = useSuiClient();

  // 1. Upload image
  await upload([imageFile]);
  const imageBlobId = '...'; // From result

  // 2. Create/upload metadata JSON
  const metaJson = {
    name: metadata.name,
    description: metadata.description,
    image: `walrus://${imageBlobId}`, // Standard ref [web:127]
    attributes: { traits: metadata.attributes },
  };
  const metaBlob = new Blob([JSON.stringify(metaJson)], { type: 'application/json' });
  const { blobId: metaBlobId } = await upload([metaBlob]);

  // 3. Mint tx (using NFT module, e.g., your package)
  const tx = new Transaction();
  const [nft] = tx.moveCall({
    target: `${PACKAGE_ID}::nft::mint_to_sender`,
    arguments: [
      tx.pure(metadata.name),
      tx.pure(metadata.description),
      tx.pure(`walrus://${metaBlobId}`), // NFT url points to metadata blob
    ],
  });
  await account.signAndExecuteTransaction({ transaction: tx });
}
```


## Move Contract Example

Standard Sui NFT (key, store abilities); display via url field.

```move
// sources/nft.move
module walrus_starter::nft {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::url::{Self, Url};
    use std::string;

    public struct NFT has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        url: Url, // "walrus://{metaBlobId}"
    }

    public fun mint(
        name: vector<u8>,
        description: vector<u8>,
        url_str: vector<u8>, // Pass metaBlobId as "walrus://..."
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url_str),
        };
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    public fun url(nft: &NFT): &Url { &nft.url }
    public fun name(nft: &NFT): &string::String { &nft.name }
}
```
Publish, call `mint` entrypoint. [docs.sui](https://docs.sui.io/guides/developer/nft)

## Best Practices

- **Dynamic Fields**: Add attributes as dynamic_object fields for composability.
- **Collection**: Mint collection NFT first; link via collection_id.
- **Walrus Sites**: Host metadata viewer at walrus.site/{metaBlobId} for rich display. [stakin](https://stakin.com/blog/how-to-build-your-own-walrus-site)
- **Standards**: Suiet/SuiNS compatibility; test rendering in Suiet Wallet. [std.suiet](https://std.suiet.app/nft/)
````

## File: React Hooks Patterns for Walrus.md
````markdown
React hooks for Walrus integrate with @mysten/walrus and @mysten/dapp-kit, using useSuiClientQuery for metadata and custom logic for upload/download with progress. Zustand suits queue/state management over Context for scalability; Suspense enables lazy blob loading via throw promise patterns. These patterns ensure optimistic UI, error resilience, and concurrent fetches. [github](https://github.com/bezkoder/react-typescript-file-upload)

## Core Hooks Design

```typescript
// hooks/useWalrus.ts
import { useMemo, useState, useCallback } from 'react';
import { WalrusClient } from '@mysten/walrus';
import { useSuiClient } from '@mysten/dapp-kit';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Global upload queue store (Zustand)
interface QueueItem { id: string; file: File; progress: number; status: 'pending'|'uploading'|'done'|'error'; blobId?: string; }
interface QueueStore { queue: QueueItem[]; add: (item: Omit<QueueItem,'id'>) => void; update: (id: string, updates: Partial<QueueItem>) => void; }
export const useQueueStore = create<QueueStore>()(
  devtools(persist((set, get) => ({
    queue: [],
    add: (item) => set({ queue: [...get().queue, { ...item, id: crypto.randomUUID(), progress: 0, status: 'pending' }] }),
    update: (id, updates) => set({ queue: get().queue.map(q => q.id === id ? { ...q, ...updates } : q) }),
  }), { name: 'walrus-queue' }))
);

// useWalrusUpload: Progress-tracked upload
export function useWalrusUpload(epochs: number = 4) {
  const client = useSuiClient();
  const [uploading, setUploading] = useState(false);
  const addToQueue = useQueueStore(s => s.add);
  const updateQueue = useQueueStore(s => s.update);

  const upload = useCallback(async (files: File[], signer?: any) => {
    const walrus = await WalrusClient.fromClient(client, { signer });
    setUploading(true);
    const promises = files.map(async (file) => {
      const id = crypto.randomUUID();
      addToQueue({ file, progress: 0, status: 'uploading' });
      try {
        // Simulate progress; use walrus.writeFiles with relay
        const result = await walrus.writeFiles([{ contents: file }], { epochs });
        updateQueue(id, { progress: 100, status: 'done', blobId: result.blobId });
      } catch (e) {
        updateQueue(id, { status: 'error' });
      }
    });
    await Promise.all(promises);
    setUploading(false);
  }, [client, epochs]);

  return { upload, uploading, queue: useQueueStore(s => s.queue) };
}

// useWalrusDownload: Cached fetch
export function useWalrusDownload(blobId: string | null) {
  const client = useSuiClient();
  const [data, setData] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);

  const download = useCallback(async () => {
    if (!blobId) return;
    setLoading(true);
    const walrus = await WalrusClient.fromClient(client);
    const blob = await walrus.readBlob(blobId);
    setData(blob);
    setLoading(false);
  }, [blobId, client]);

  return { data, loading, download };
}

// useWalrusMetadata: Query hook
import { useSuiClientQuery } from '@mysten/dapp-kit';
export function useWalrusMetadata(blobId: string) {
  return useSuiClientQuery({
    method: 'suix_getObject', // Or custom Walrus query
    params: [blobId],
    options: { enabled: !!blobId, staleTime: 5 * 60 * 1000 },
  });
}
```


## State & Queue Management

Use Zustand for queue (add/update items); pair with TanStack Query for metadata. Error boundaries wrap uploads:

```typescript
// ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <div>Upload failed</div> : this.props.children; }
}
```
Zustand > Context for non-render-blocking updates. [reddit](https://www.reddit.com/r/react/comments/1fp27ek/state_management_when_to_use_context_api_vs_redux/)

## Suspense & Optimistic Patterns

Wrap downloads in Suspense for lazy loading; throw promises for concurrent fetches.

```typescript
// BlobViewer.tsx (Suspense-enabled)
let cache = new Map();
async function fetchBlob(blobId: string) {
  if (cache.has(blobId)) return cache.get(blobId);
  const promise = (async () => {
    const walrus = await WalrusClient.load(/*...*/);
    const data = await walrus.readBlob(blobId);
    cache.set(blobId, data);
    return data;
  })();
  cache.set(blobId, promise);
  return promise;
}

function BlobViewer({ blobId }: { blobId: string }) {
  throw fetchBlob(blobId); // Suspends
}

<Suspense fallback={<div>Loading blob...</div>}>
  <BlobViewer blobId={blobId} />
</Suspense>
```
Optimistic: Update queue to 'uploading' pre-call, rollback on error. [17.reactjs](https://17.reactjs.org/docs/concurrent-mode-suspense.html)
````

## File: Sui Wallet Integration Patterns.md
````markdown
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
````

