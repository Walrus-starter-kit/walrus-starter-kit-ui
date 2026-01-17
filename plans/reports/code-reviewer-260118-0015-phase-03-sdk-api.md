# Code Review: Phase 03 SDK API Update

**Reviewer**: code-reviewer-a1d0e20
**Date**: 2026-01-18
**Scope**: SDK v0.9.0 API migration (adapter.ts, storage.ts)

---

## Overall Score: 7/10

**Summary**: Changes correctly implement v0.9.0 object-based API pattern. TypeScript compilation passed. Architecture follows YAGNI/KISS. However, critical signer validation missing, unused option parameter, metadata fallback risks.

---

## Critical Issues

### 1. **Signer Field Not Used in Upload (P0)**
**File**: `packages/cli/templates/sdk-mysten/src/adapter.ts:21`

**Problem**: `options?.signer` field added to interface but NOT passed to SDK method. Upload will likely fail at runtime.

**Current**:
```typescript
const result = await client.writeBlobToUploadRelay({
  blob,
  nEpochs: options?.epochs || 1,
  // Missing: signer field
});
```

**Expected** (per Phase 3 plan Step 2):
```typescript
const result = await client.writeBlobToUploadRelay({
  blob,
  nEpochs: options?.epochs || 1,
  signer: options?.signer, // Required by v0.9.0
});
```

**Impact**: Upload will fail if SDK enforces signer requirement. Phase 4 blocked.

---

### 2. **Metadata Fallback Uses Current Timestamp**
**File**: `packages/cli/templates/sdk-mysten/src/adapter.ts:66`

**Problem**: `createdAt: metadata.createdAt || Date.now()` masks missing metadata with current time, causing incorrect data.

**Risk**:
- Silent data corruption if SDK returns undefined
- Debugging difficulty (no error thrown)

**Fix**: Throw error if createdAt missing:
```typescript
if (!metadata.createdAt) {
  throw new Error(`Metadata missing createdAt for blob ${blobId}`);
}
return {
  blobId,
  size: metadata.unencoded_length,
  contentType: metadata.contentType,
  createdAt: metadata.createdAt,
};
```

---

## High Priority Warnings

### 3. **Metadata V1 Access Without Validation**
**File**: `packages/cli/templates/sdk-mysten/src/adapter.ts:60`

**Problem**: Direct access to `response.metadata.V1` assumes SDK always returns V1 structure. No runtime check.

**Risk**: Runtime crash if SDK returns different version or null.

**Suggestion**: Add validation:
```typescript
if (!response.metadata?.V1) {
  throw new Error(`Unsupported metadata version for blob ${blobId}`);
}
const metadata = response.metadata.V1;
```

---

### 4. **Unused `options?.signer` Parameter**
**File**: `packages/cli/templates/base/src/adapters/storage.ts:22`

**Problem**: Signer field added to interface but never used in implementation. Violates YAGNI.

**Status**: Acceptable if Phase 4 imminent (per plan). Otherwise remove until needed.

---

### 5. **Generic Error Swallowing in exists()**
**File**: `packages/cli/templates/sdk-mysten/src/adapter.ts:79`

**Problem**: All errors (network, auth, invalid blobId) return `false`. Misleads caller.

**Example**:
- Network timeout → returns false (blob may exist)
- Invalid blobId → returns false (correct)

**Fix**: Differentiate errors:
```typescript
async exists(blobId: string): Promise<boolean> {
  try {
    await this.getMetadata(blobId);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return false;
    }
    throw error; // Re-throw network/auth errors
  }
}
```

---

## Medium Priority Suggestions

### 6. **DownloadOptions.range Parameter Not Used**
**File**: `packages/cli/templates/base/src/adapters/storage.ts:25-28`

**Issue**: Interface defines `range` option but `download()` method ignores it.

**Action**: Either implement range downloads or remove from interface (YAGNI).

---

### 7. **contentType Not Passed to SDK**
**File**: `packages/cli/templates/sdk-mysten/src/adapter.ts:21`

**Issue**: `options?.contentType` defined in interface but not sent to SDK.

**Impact**: SDK may not store content type metadata.

**Check**: Verify if v0.9.0 SDK accepts contentType parameter.

---

## Low Priority

### 8. **Type Safety: `any` for Signer**
**Status**: Acceptable per plan (Phase 4 will type properly). Document in TODO.

---

## Positive Observations

✅ Object-based API migration correct
✅ TypeScript compilation passed
✅ Clean error messages with context
✅ Follows existing adapter interface
✅ KISS principle: minimal changes

---

## Recommended Actions (Priority Order)

1. **[P0]** Add `signer: options?.signer` to `writeBlobToUploadRelay()` call
2. **[P0]** Remove fallback `|| Date.now()` from createdAt (throw error instead)
3. **[P1]** Add metadata.V1 validation before access
4. **[P1]** Fix `exists()` to differentiate "not found" vs network errors
5. **[P2]** Verify contentType handling in SDK v0.9.0 API
6. **[P2]** Remove unused `range` option or implement it
7. **[P3]** Document signer usage in Phase 4 plan

---

## Metrics

- **Files Modified**: 2
- **Lines Changed**: ~15
- **Type Coverage**: 100% (passes tsc)
- **YAGNI Violations**: 2 (unused signer, unused range)
- **DRY**: ✅ No duplication
- **KISS**: ✅ Minimal complexity

---

## Architecture Assessment

**Pattern**: Adapter pattern correctly isolates SDK changes
**Layering**: Base interface unchanged, SDK layer updated ✅
**Dependencies**: Phase 4 (wallet) must complete signer integration

---

## Security Check

⚠️ **Signer Validation Missing**: No check if signer valid before SDK call
⚠️ **Error Messages Expose BlobIds**: Acceptable (not sensitive)
✅ **No Secrets in Code**: Pass

---

## Unresolved Questions

1. Does SDK v0.9.0 `writeBlobToUploadRelay()` require `signer` or is it optional?
2. Should `deletable` parameter be exposed in UploadOptions interface?
3. Is `metadata.createdAt` guaranteed by SDK or can it be undefined?
4. Does SDK support `contentType` parameter in v0.9.0?
5. When will Phase 4 wallet integration start?
