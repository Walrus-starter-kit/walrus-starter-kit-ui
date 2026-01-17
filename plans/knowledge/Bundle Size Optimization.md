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