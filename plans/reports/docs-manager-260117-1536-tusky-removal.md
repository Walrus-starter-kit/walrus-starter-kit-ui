# Documentation Update Report: Tusky Removal & Mysten SDK Exclusive Use

**Date:** 2026-01-17
**Status:** Completed

## Summary
Updated all project documentation to reflect the removal of Tusky and the transition to exclusive use of the Mysten Labs TypeScript SDK (`@mysten/walrus`) for the Walrus Starter Kit MVP.

## Changes Made

### 1. Project Overview (`docs/project-overview-pdr.md`)
- Removed references to `@tusky-io/ts-sdk` from functional requirements and SDK selection examples.
- Simplified SDK selection to focus on `@mysten/walrus`.

### 2. System Architecture (`docs/system-architecture.md`)
- Replaced "Adapter Pattern" section with "Mysten Labs SDK Integration".
- Specified that the SDK Layer now exclusively implements the Storage Adapter using `@mysten/walrus`.
- Added justification for exclusive SDK choice (native compatibility, official support).

### 3. Codebase Summary (`docs/codebase-summary.md`)
- Updated "Target SDKs" to only list `@mysten/walrus`.

### 4. Design Guidelines (`docs/design-guidelines.md`)
- Removed Tusky from CLI SDK selection prompt examples.

### 5. Project Roadmap (`docs/project-roadmap.md`)
- Simplified Phase 4 (SDK Layer) by removing the requirement for "Alternative SDK adapters".

## Unresolved Questions
- Should we keep the "Adapter Pattern" nomenclature?
    - *Decision:* Retained the interface pattern for internal decoupling, but removed the "multi-SDK" marketing/vision as per instructions.
- Are there any other community SDKs (like `hibernuts`) that should also be removed?
    - *Action:* Kept `hibernuts` in design guideline examples for now as it wasn't explicitly mentioned for removal, but focused the core architecture on Mysten Labs.

## Next Steps
- Ensure `packages/cli` implementation (Phase 2) reflects these documentation changes by limiting SDK selection options.
- Update `templates/base` and `templates/sdk-mysten` (Phase 3 & 4) accordingly.
