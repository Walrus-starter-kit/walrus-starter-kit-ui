# Next.js App Router for Walrus Integration

## 1. App Router Structure

**Optimal Folder Structure:**

```
/app
  /providers.tsx       # Wrap QueryClient + SuiClient + WalletProvider
  /layout.tsx          # Root layout importing providers
  /dashboard/          # Protected route group
    page.tsx           # Server Component (shell)
    layout.tsx         # Dashboard specific layout
/components
  /walrus/             # Walrus specific components
    UploadZone.tsx     # Client Component (drag & drop)
    BlobPreview.tsx    # Server Component (metadata fetch)
/lib
  /walrus/             # Walrus SDK configuration
    client.ts          # Singleton instance
  /hooks/              # Custom hooks
```

**Component Architecture:**

- **Server Components:** Use for fetching blob metadata, resolving SuiNS names, and rendering initial HTML.
- **Client Components:** REQUIRED for wallet connections (`@mysten/dapp-kit`), file selection, and signing transactions.
- **Boundary:** Pass data from Server -> Client via props (serialized JSON).

## 2. Client-Side Patterns

**Wallet Connection (Sui):**

- Use `@mysten/dapp-kit` providers in a client-side wrapper (`providers.tsx`).
- `ConnectButton` must be rendered client-side.
- **Pattern:** wrap the entire app in `SuiClientProvider` and `WalletProvider` but keep the `layout.tsx` as a Server Component by importing the client wrapper.

**Walrus File Upload (Direct-to-Publisher):**

- **Do not** proxy large files through Next.js API routes (serverless timeout risk).
- **Pattern:**
  1. User selects file in Client Component.
  2. Component initializes `WalrusClient` (or uses `useWalrus` hook).
  3. Upload directly to Walrus Publisher node from browser.
  4. **State:** Use `useMutation` (TanStack Query) to track upload progress.

## 3. Performance Optimization

**Code Splitting:**

- Lazy load heavy SDKs. The Walrus SDK and Sui SDK can be large.

```typescript
const WalrusUploader = dynamic(() => import('@/components/walrus/UploadZone'), {
  loading: () => <Skeleton />,
  ssr: false // Wallet interactions are browser-only
})
```

**Streaming & Suspense:**

- Wrap blob galleries in `<Suspense fallback={<GridSkeleton />}>`.
- Use `loading.tsx` for route transitions.

**Error Boundaries:**

- Create `error.tsx` in route segments to handle Walrus node failures gracefully without crashing the shell.

## 4. Environment Configuration

**.env.local Setup:**

```bash
# Public (Client)
NEXT_PUBLIC_SUI_NETWORK="testnet"
NEXT_PUBLIC_WALRUS_PUBLISHER="https://publisher.walrus-testnet.walrus.space"
NEXT_PUBLIC_WALRUS_AGGREGATOR="https://aggregator.walrus-testnet.walrus.space"

# Private (Server - if needed for specialized indexing)
WALRUS_API_KEY="..."
```

## 5. Key Insights

1. **Providers Pattern:** Create a `providers.tsx` Client Component to wrap the app with `@mysten/dapp-kit` context, keeping the root layout as a Server Component.
2. **Direct Uploads:** Always upload files directly from the client to the Walrus publisher node to avoid server bottlenecks and timeouts.
3. **SSR for Metadata:** Use Server Components to fetch and display blob metadata/lists for better SEO and initial load performance.
4. **Dynamic Wallets:** Dynamically import wallet connection components to reduce initial bundle size (~50KB+ savings).

## Sources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Sui dApp Kit Documentation](https://sdk.mystenlabs.com/dapp-kit)
- [Walrus SDK Documentation](https://docs.walrus.site/)
- [Mysten Labs dApp Templates](https://github.com/MystenLabs/sui/tree/main/dapps)
