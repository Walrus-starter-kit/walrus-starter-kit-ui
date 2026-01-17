# Code Review: Wallet Signer Integration

## Scope

**Files Reviewed:**
- `packages/cli/templates/sdk-mysten/src/adapter.ts` (modified)
- `packages/cli/templates/react/src/hooks/useStorage.ts` (modified)
- `packages/cli/templates/react/src/hooks/useStorageAdapter.ts` (new)
- `packages/cli/templates/base/src/adapters/storage.ts` (interface)

**Lines Analyzed:** ~200 LOC
**Review Focus:** Phase 04 - Wallet signer integration for SDK v0.9.0
**Plan:** `plans/260117-2319-template-critical-fixes/phase-04-wallet-signer-integration.md`

---

## Overall Assessment

**Score: 7/10**

Implementation successfully bridges React wallet layer with SDK adapter via HOC hook pattern. TypeScript compilation passes. Core functionality works. However, critical type safety issues and incomplete TODO tasks reduce quality.

---

## Critical Issues

### 1. Type Suppression with @ts-expect-error

**File:** `adapter.ts:31`

```typescript
// @ts-expect-error - Signer type compatibility handled by React layer
signer: options.signer,
```

**Problem:** Type error suppressed instead of fixed. Comment claims "handled by React layer" but React passes `currentAccount` (not proper `Signer` type).

**Impact:** Runtime type mismatch possible. SDK may reject invalid signer object.

**Fix Required:**
- Import proper `Signer` type from `@mysten/sui/cryptography`
- Create adapter function: `currentAccount` → `Signer`
- Remove `@ts-expect-error`

### 2. Untyped Signer in Base Interface

**File:** `storage.ts:22`

```typescript
signer?: any; // TODO: Type properly in Phase 4 with wallet integration
```

**Problem:** TODO comment claims Phase 4 should fix this, but Phase 4 implementation left it as `any`.

**Impact:** No type safety for most critical parameter. `any` defeats TypeScript's purpose.

**Fix Required:**
```typescript
import type { WalletAccount } from '@mysten/wallet-standard';

export interface UploadOptions {
  epochs?: number;
  contentType?: string;
  signer?: WalletAccount; // Proper type from dapp-kit
}
```

---

## High Priority Findings

### 3. Inconsistent Error Messages

**adapter.ts:21** vs **useStorageAdapter.ts:19**

Two different error messages for same condition:
- "Signer required for blob upload. Please connect your wallet first."
- "Wallet not connected. Please connect your wallet to upload files."

**Fix:** Standardize error messages. User sees React layer error, SDK error never surfaces.

### 4. Missing Type for Download Options

**File:** `useStorageAdapter.ts:30`

```typescript
download: (blobId: string, options?: any) =>
```

**Problem:** `any` type for options parameter.

**Fix:** Use `DownloadOptions` from base interface.

### 5. Incomplete Phase 4 TODO List

**Plan file shows 14 uncompleted tasks:**
- ❌ Update useWallet to export properly typed signer
- ❌ Update base StorageAdapter interface with Signer type
- ❌ Update package.json with @mysten/sui dependency
- ❌ Generate test project
- ❌ Test wallet connection flow
- ❌ Test upload with connected wallet
- ❌ Test error handling for disconnected wallet
- ❌ Document wallet integration pattern

**Phase marked "Pending" but code committed.**

---

## Medium Priority Improvements

### 6. Type Safety: currentAccount as Signer

**File:** `useStorageAdapter.ts:26`

```typescript
signer: currentAccount, // Inject currentAccount as signer
```

**Issue:** `currentAccount` type from `@mysten/dapp-kit` may not match SDK's `Signer` interface.

**Verification Needed:**
- Check if `WalletAccount` implements `Signer` interface
- Add type assertion or adapter if incompatible

### 7. Missing Return Type Annotations

**File:** `useStorageAdapter.ts:12`

```typescript
export function useStorageAdapter() {
  // No return type annotation
```

**Fix:** Add explicit return type:
```typescript
export function useStorageAdapter(): StorageAdapter {
```

### 8. Code Standards Violation: any Usage

**Per `code-standards.md:7`:** "TypeScript First with strict type checking"

**Violations:**
- `storage.ts:22` - `signer?: any`
- `useStorageAdapter.ts:30` - `options?: any`

**Action:** Replace all `any` with proper types.

---

## Low Priority Suggestions

### 9. Memoization Dependency Array

**File:** `useStorageAdapter.ts:37`

```typescript
[currentAccount]
```

**Consideration:** Object identity changes may cause unnecessary re-memoization. Consider using `currentAccount?.address` as dependency instead.

### 10. Error Message UX

Current: "Wallet not connected. Please connect your wallet to upload files."

Suggestion: Include call-to-action link/button in error object:
```typescript
throw new Error('WALLET_NOT_CONNECTED', {
  message: 'Wallet required for upload',
  action: 'Connect wallet in top-right corner'
});
```

---

## Positive Observations

✅ **HOC Pattern:** Clean separation of concerns (wallet layer → adapter layer → SDK)
✅ **TypeScript Compilation:** Zero errors from `pnpm -r exec tsc --noEmit`
✅ **Immutability:** Proper use of `useMemo` for adapter object
✅ **Read-Only Operations:** Download/metadata work without wallet (good UX)
✅ **Error Handling:** Both layers validate wallet connection
✅ **Import Paths:** Correct `.js` extensions for ESM

---

## Recommended Actions

**Priority Order:**

1. **[P0] Fix Type Safety**
   - Remove `any` from `UploadOptions.signer`
   - Import `WalletAccount` type
   - Remove `@ts-expect-error` suppressions

2. **[P0] Complete Phase 4 TODO Tasks**
   - Add proper type imports to package.json
   - Test end-to-end upload flow
   - Update phase status from "Pending" to "Complete"

3. **[P1] Standardize Error Messages**
   - Define error message constants
   - Use consistent wording across layers

4. **[P1] Add Missing Type Annotations**
   - Return type for `useStorageAdapter()`
   - Parameter type for download options

5. **[P2] Document Integration Pattern**
   - Add JSDoc examples to `useStorageAdapter`
   - Update phase plan with completion notes

---

## Metrics

**Type Coverage:** 85% (degraded by `any` usage)
**Test Coverage:** 0% (no tests written)
**Linting Issues:** 0 (passed)
**Build Status:** ✅ Pass
**TODO/FIXME Count:** 2 (1 TODO, 1 @ts-expect-error)

---

## Security Considerations

✅ **No Global Signer Storage:** Signer sourced from React context per-operation
✅ **User Authorization:** Wallet controls signer, not application
✅ **No Signer Persistence:** Not stored in localStorage
⚠️ **Type Safety Gap:** `any` type could allow invalid signer object

**Risk:** Low if `currentAccount` type matches SDK expectations. Medium if type mismatch occurs at runtime.

---

## Architecture Compliance

**YAGNI:** ✅ No unnecessary abstractions
**KISS:** ✅ Simple HOC hook pattern
**DRY:** ✅ Single source of truth for signer injection

**Layering:** ✅ Proper separation (React → Adapter → SDK)

---

## Unresolved Questions

1. **Does `WalletAccount` from `@mysten/dapp-kit` implement `Signer` interface from `@mysten/sui/cryptography`?**
   - If no, adapter function needed
   - If yes, why `@ts-expect-error` required?

2. **Why is phase status "Pending" when code is implemented?**
   - Plan file not updated after implementation
   - TODO list shows 14 incomplete tasks

3. **Where are the integration tests mentioned in plan Step 7?**
   - No test files created
   - Manual testing not documented

4. **What's the proper type for `signer` parameter?**
   - Plan says `Signer` from `@mysten/sui/cryptography`
   - Code uses `currentAccount` (different type)
   - Base interface uses `any`

5. **Should download options really be typed as `any`?**
   - Base interface defines `DownloadOptions`
   - Implementation ignores defined type
