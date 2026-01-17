Vite handles env vars with VITE_ prefix exposed client-side, loading .env → .env.local → .env.[mode] → .env.[mode].local (mode-specific overrides). Type-safe access via import.meta.env.VITE_FOO or ViteEnvs interface. Build auto tree-shakes ESM, splits routes/components dynamically. [vite](https://vite.dev/guide/env-and-mode)

## Optimized vite.config.ts

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Tailwind v4+ plugin [web:118]
import { VitePWA } from 'vite-plugin-pwa'; // PWA [web:113]
import path from 'path';

export default defineConfig(({ command, mode }) => {
  // Load env vars
  const env = loadEnv(mode, process.cwd(), ''); // '' exposes all VITE_*
  return {
    plugins: [
      react({ 
        babel: { plugins: [['@babel/plugin-transform-typescript'] ] } // TS opts
      }),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Walrus Starter Kit',
          short_name: 'WalrusKit',
          icons: [ /* array of sizes */ ],
          theme_color: '#ffffff',
          background_color: '#ffffff',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext', // Modern browsers
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          pure_funcs: ['console.log'],
        },
      },
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'], // Vendor chunk
            sui: ['@mysten/sui', '@mysten/walrus'], // Walrus deps
          },
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
      chunkSizeWarningLimit: 1000, // KB
    },
    server: {
      port: 3000,
      open: true,
    },
    envPrefix: 'VITE_', // Expose only VITE_*
    define: {
      // Type-safe env (in env.d.ts: interface ImportMetaEnv { 'VITE_WALRUS_RPC': string })
      __WALRUS_RPC__: JSON.stringify(env.VITE_WALRUS_RPC),
    },
    css: {
      postcss: {
        plugins: [tailwindcss()], // Legacy Tailwind v3
      },
    },
    optimizeDeps: {
      include: ['@mysten/walrus'], // Pre-bundle heavy deps
    },
  };
});
```


## Key Optimizations Explained

- **Code Splitting**: manualChunks groups vendors/Walrus; dynamic imports for routes auto-split. [vite](https://vite.dev/guide/features)
- **Tree-shaking**: ESM + terser compress removes dead code; drop_console in prod. [calpa](https://calpa.me/blog/frontend-performance-optimization-tree-shaking-bundle-analysis-code-splitting-in-vite/)
- **Env Safety**: VITE_WALRUS_EPOCHS etc.; env.d.ts:
  ```typescript
  interface ImportMetaEnv {
    readonly VITE_WALRUS_RPC: string;
    readonly VITE_SUI_NETWORK: 'testnet' | 'mainnet';
  }
  ```
  Access: `const rpc = import.meta.env.VITE_WALRUS_RPC`. [stackoverflow](https://stackoverflow.com/questions/74168587/how-to-use-an-env-variable-in-vite-with-typescript)
- **Plugins**: @vitejs/plugin-react (TSX/JSX), @tailwindcss/vite (JIT), vite-plugin-pwa (offline). [davidschinteie.hashnode](https://davidschinteie.hashnode.dev/react-pwa-with-typescript-using-cra-or-vite)

## Loading Order

.env (all modes) ← .env.local (gitignored) ← .env.development/.env.production ← .env.[mode].local. Restart dev server on changes. [vite](https://vite.dev/guide/env-and-mode.md)