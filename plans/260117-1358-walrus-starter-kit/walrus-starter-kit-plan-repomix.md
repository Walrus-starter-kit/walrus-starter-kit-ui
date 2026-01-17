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
phase-01-monorepo-foundation.md
phase-02-cli-engine-core.md
phase-03-template-base-layer.md
phase-04-sdk-layer.md
phase-05-framework-layer.md
phase-06-use-case-layers.md
phase-07-generation-engine.md
phase-08-post-install.md
plan.md
```

# Files

## File: phase-01-monorepo-foundation.md

````markdown
# Phase 1: Monorepo Foundation

## Context Links

- [Main Plan](./plan.md)
- [PRD](../../POC/PRD.md)
- [pnpm Monorepo Research](../reports/researcher-260117-1353-pnpm-monorepo.md)

## Overview

**Created:** 2026-01-17  
**Priority:** High  
**Status:** pending  
**Estimated Effort:** 4 hours  
**Dependencies:** None (foundational)

## Key Insights

### From Research

1. **Templates are Data, Not Packages**: Exclude templates from workspace to prevent pnpm linking issues
2. **Strict Separation**: Tooling (`packages/cli`) vs Assets (`templates/`)
3. **Test Generated Output**: Lint the output, not template source
4. **Single Publish Point**: CLI package includes templates in distribution

### Critical Pattern

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  # Templates excluded - they're static assets
```

## Requirements

### Functional

- pnpm workspace with proper package isolation
- Root-level shared tooling (TypeScript, ESLint, Prettier)
- Git ignore patterns for generated files
- npm publish-ready structure

### Technical

- Node.js 18+ enforcement via `engines`
- pnpm 9+ requirement
- TypeScript 5.3+ with strict mode
- ESM-first architecture

### Dependencies

None (this is the foundation)

## Architecture

### Directory Structure

```
walrus-starter-kit/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint + test
│       └── publish.yml         # npm publish automation
├── packages/
│   └── cli/                    # The scaffolder
│       ├── src/
│       │   └── index.ts        # Entry point (stub)
│       ├── package.json        # CLI package config
│       └── tsconfig.json       # CLI-specific TS config
├── templates/                  # Static assets (excluded from workspace)
│   └── .gitkeep                # Placeholder
├── examples/                   # Test output (included in workspace)
│   └── .gitkeep                # Placeholder
├── .gitignore
├── .npmrc                      # pnpm config
├── .prettierrc.json
├── .eslintrc.json
├── package.json                # Root package
├── pnpm-workspace.yaml
├── tsconfig.json               # Base TS config
└── README.md
```

### Root package.json Schema

```json
{
  "name": "walrus-starter-kit",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=9.0.0"
  },
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.19.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "prettier": "^3.2.0"
  }
}
```

### CLI package.json Schema

```json
{
  "name": "create-walrus-app",
  "version": "0.1.0",
  "description": "Interactive CLI for scaffolding Walrus applications",
  "type": "module",
  "bin": {
    "create-walrus-app": "./dist/index.js"
  },
  "files": ["dist", "templates"],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "echo \"Test placeholder\""
  },
  "keywords": ["walrus", "sui", "scaffold", "cli", "template"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "commander": "^11.1.0",
    "prompts": "^2.4.2",
    "kleur": "^4.1.5",
    "fs-extra": "^11.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/prompts": "^2.4.9",
    "@types/fs-extra": "^11.0.4",
    "typescript": "^5.3.0"
  }
}
```

## Related Code Files

### To Create

1. `pnpm-workspace.yaml` - Workspace definition
2. `package.json` - Root package
3. `.gitignore` - Git exclusions
4. `.npmrc` - pnpm configuration
5. `tsconfig.json` - Base TypeScript config
6. `.prettierrc.json` - Code formatting
7. `.eslintrc.json` - Linting rules
8. `packages/cli/package.json` - CLI package
9. `packages/cli/tsconfig.json` - CLI TS config
10. `packages/cli/src/index.ts` - Entry stub
11. `README.md` - Project documentation

## Implementation Steps

### Step 1: Initialize pnpm Workspace (30 min)

1. Create root directory structure:

```bash
mkdir -p walrus-starter-kit/{packages/cli/src,templates,examples,.github/workflows}
cd walrus-starter-kit
```

2. Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
  - 'examples/*'
  # Templates excluded - static assets only
```

3. Create `.npmrc`:

```
shamefully-hoist=true
strict-peer-dependencies=false
```

### Step 2: Root Configuration (45 min)

4. Create root `package.json` (use schema above)

5. Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "exclude": ["node_modules", "dist", "templates"]
}
```

6. Create `.prettierrc.json`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

7. Create `.eslintrc.json`:

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "plugins": ["@typescript-eslint"],
  "env": {
    "node": true,
    "es2022": true
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
```

### Step 3: CLI Package Setup (1 hour)

8. Create `packages/cli/package.json` (use schema above)

9. Create `packages/cli/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

10. Create `packages/cli/src/index.ts`:

```typescript
#!/usr/bin/env node

console.log('🚀 Walrus Starter Kit - Coming Soon!');
process.exit(0);
```

### Step 4: Git Configuration (30 min)

11. Create `.gitignore`:

```
# Dependencies
node_modules/
.pnpm-debug.log

# Build outputs
dist/
*.tsbuildinfo

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Test outputs
examples/test-*
```

12. Initialize git:

```bash
git init
git add .
git commit -m "chore: initialize monorepo foundation"
```

### Step 5: Dependency Installation (30 min)

13. Install root dependencies:

```bash
pnpm install
```

14. Install CLI dependencies:

```bash
cd packages/cli
pnpm install
cd ../..
```

### Step 6: Build Validation (45 min)

15. Test TypeScript compilation:

```bash
cd packages/cli
pnpm build
```

16. Verify executable:

```bash
chmod +x dist/index.js
node dist/index.js
# Should output: 🚀 Walrus Starter Kit - Coming Soon!
```

17. Test local linking:

```bash
pnpm link --global
create-walrus-app
# Should output: 🚀 Walrus Starter Kit - Coming Soon!
```

## Todo List

- [ ] Create directory structure
- [ ] Write `pnpm-workspace.yaml`
- [ ] Write `.npmrc`
- [ ] Write root `package.json`
- [ ] Write `tsconfig.json`
- [ ] Write `.prettierrc.json`
- [ ] Write `.eslintrc.json`
- [ ] Write `packages/cli/package.json`
- [ ] Write `packages/cli/tsconfig.json`
- [ ] Write `packages/cli/src/index.ts`
- [ ] Write `.gitignore`
- [ ] Initialize git repository
- [ ] Install root dependencies
- [ ] Install CLI dependencies
- [ ] Build CLI package
- [ ] Test CLI executable
- [ ] Verify global linking
- [ ] Create placeholder README.md

## Success Criteria

### Functional Tests

- [ ] `pnpm install` completes without errors
- [ ] `pnpm -r build` compiles CLI successfully
- [ ] `create-walrus-app` runs after global link
- [ ] TypeScript strict mode passes
- [ ] ESLint passes on all `.ts` files
- [ ] Prettier check passes

### Structure Validation

- [ ] Templates excluded from workspace packages
- [ ] CLI package has correct `bin` entry
- [ ] `files` array includes `templates` for publish
- [ ] Node/pnpm versions enforced

### Documentation

- [ ] README explains monorepo structure
- [ ] Package purposes documented

## Risk Assessment

### Potential Blockers

1. **pnpm version mismatch**: User has older pnpm
   - **Mitigation**: Clear error message + docs
2. **Template exclusion issues**: pnpm tries to link templates
   - **Mitigation**: Test workspace.yaml carefully
3. **Cross-platform path issues**: Windows vs Unix
   - **Mitigation**: Use `path.join()` everywhere

### Contingency Plans

- If pnpm workspace fails: Fall back to npm workspaces (less ideal)
- If linking breaks: Provide manual test script

## Security Considerations

### Phase-Specific Concerns

1. **Dependency Pinning**: Pin major versions for stability
2. **Engine Enforcement**: Prevent running on unsupported Node versions
3. **Git Secrets**: Ensure `.env` patterns in gitignore
4. **npm Publish**: Validate `files` array doesn't leak secrets

### Hardening Measures

- Use `engines.strict = true` in `.npmrc`
- Review all dependencies for known vulnerabilities
- Add `prepublishOnly` script to prevent accidental publish

## Next Steps

After Phase 1 completion:

1. **Phase 2**: Build CLI Engine Core (prompts + validation)
2. **Phase 3**: Create Template Base Layer (adapter interface)
3. **Parallel**: Start template development while CLI engine builds

### Dependencies for Next Phase

Phase 2 requires:

- Working CLI package build system ✅
- pnpm workspace for testing ✅
- TypeScript compilation ✅

### Open Questions

- Should we use Turborepo for caching? (Decision: No for MVP, monorepo is simple)
- Versioning strategy: Lock-step or independent? (Decision: Lock-step for MVP)
````

## File: phase-02-cli-engine-core.md

````markdown
# Phase 2: CLI Engine Core

## Context Links

- [Main Plan](./plan.md)
- [PRD](../../POC/PRD.md)
- [CLI Scaffolding Research](../reports/researcher-260117-1353-cli-scaffolding.md)
- [Phase 1: Monorepo Foundation](./phase-01-monorepo-foundation.md)

## Overview

**Created:** 2026-01-17  
**Priority:** High  
**Status:** pending  
**Estimated Effort:** 6 hours  
**Dependencies:** Phase 1 complete

## Key Insights

### From Research

1. **Pipeline Architecture**: Entry → Parse → Prompt → Validate → Execute
2. **Context Object**: Single source of truth for user choices
3. **Hybrid Mode**: Support both interactive and CI/CD (all flags)
4. **Validation First**: Check compatibility before file operations
5. **Graceful Exit**: Clean up on SIGTERM/SIGINT

### Critical Patterns

- Commander for arg parsing (robust, industry standard)
- Prompts for interactive flow (lightweight, type-safe)
- Kleur for colored output (zero dependencies)
- Context object passed through pipeline

## Requirements

### Functional

- Interactive 6-step wizard (project name, SDK, framework, use case, analytics, tailwind)
- Non-interactive mode with CLI flags (`--sdk`, `--framework`, etc.)
- Compatibility matrix validation
- Clear error messages with suggestions
- Abort handling (cleanup partial state)

### Technical

- TypeScript strict mode
- ESM module syntax
- Cross-platform (Windows/Linux/macOS)
- Zero-config for interactive mode
- Full-config for CI/CD mode

### Dependencies

- Phase 1: Build system, package.json

## Architecture

### CLI Flow Diagram

```
Entry (index.ts)
    ↓
Parse Args (commander)
    ↓
Interactive? ──No──→ Validate Args
    ↓ Yes              ↓
Run Prompts ──────→ Build Context
    ↓
Validate Matrix
    ↓
[Phase 7: Generate] (future)
```

### Component Design

**1. index.ts** (Entry Point)

```typescript
#!/usr/bin/env node
import { program } from 'commander';
import { runPrompts } from './prompts.js';
import { validateContext } from './validator.js';
import { buildContext } from './context.js';

program
  .name('create-walrus-app')
  .argument('[project-name]', 'Project directory name')
  .option('--sdk <sdk>', 'SDK to use')
  .option('--framework <framework>', 'Framework to use')
  .option('--use-case <use-case>', 'Use case template')
  .option('--analytics', 'Include Blockberry analytics', false)
  .option('--tailwind', 'Include Tailwind CSS', true)
  .parse();
```

**2. prompts.ts** (Interactive Flow)

```typescript
import prompts from 'prompts';
import { COMPATIBILITY_MATRIX } from './matrix.js';

export async function runPrompts(initialContext: Partial<Context>) {
  return await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-walrus-app',
      validate: (name) => validateProjectName(name),
    },
    {
      type: 'select',
      name: 'sdk',
      message: 'Choose SDK:',
      choices: [
        { title: '@mysten/walrus', value: 'mysten' },
        { title: '@tusky-io/ts-sdk', value: 'tusky' },
        { title: '@hibernuts/walrus-sdk', value: 'hibernuts' },
      ],
    },
    // ... more prompts
  ]);
}
```

**3. validator.ts** (Compatibility Check)

```typescript
export const COMPATIBILITY_MATRIX = {
  mysten: {
    frameworks: ['react', 'vue', 'plain-ts'],
    useCases: ['simple-upload', 'gallery', 'defi-nft'],
  },
  // ...
};

export function validateContext(context: Context): ValidationResult {
  const { sdk, framework, useCase } = context;

  if (!COMPATIBILITY_MATRIX[sdk].frameworks.includes(framework)) {
    return {
      valid: false,
      error: `${sdk} is incompatible with ${framework}`,
      suggestion: `Try: ${COMPATIBILITY_MATRIX[sdk].frameworks[0]}`,
    };
  }

  return { valid: true };
}
```

**4. context.ts** (State Management)

```typescript
export interface Context {
  projectName: string;
  projectPath: string;
  sdk: 'mysten' | 'tusky' | 'hibernuts';
  framework: 'react' | 'vue' | 'plain-ts';
  useCase: 'simple-upload' | 'gallery' | 'defi-nft';
  analytics: boolean;
  tailwind: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
}

export function buildContext(
  args: Record<string, unknown>,
  prompts: Record<string, unknown>
): Context {
  return {
    projectName: (args.projectName || prompts.projectName) as string,
    projectPath: path.resolve(process.cwd(), projectName),
    // ... merge args + prompts
    packageManager: detectPackageManager(),
  };
}
```

## Related Code Files

### To Create

1. `packages/cli/src/index.ts` - Entry point + commander setup
2. `packages/cli/src/prompts.ts` - Interactive wizard
3. `packages/cli/src/validator.ts` - Compatibility matrix
4. `packages/cli/src/context.ts` - Context builder
5. `packages/cli/src/matrix.ts` - SDK/framework compatibility data
6. `packages/cli/src/utils/detect-pm.ts` - Package manager detection
7. `packages/cli/src/utils/validate-name.ts` - Project name validation
8. `packages/cli/src/types.ts` - TypeScript interfaces

### To Modify

- `packages/cli/package.json` - Add dependencies (commander, prompts, kleur)

## Implementation Steps

### Step 1: Add Dependencies (15 min)

1. Update `packages/cli/package.json`:

```json
{
  "dependencies": {
    "commander": "^11.1.0",
    "prompts": "^2.4.2",
    "kleur": "^4.1.5",
    "fs-extra": "^11.2.0"
  },
  "devDependencies": {
    "@types/prompts": "^2.4.9",
    "@types/fs-extra": "^11.0.4"
  }
}
```

2. Install:

```bash
cd packages/cli && pnpm install
```

### Step 2: Type Definitions (30 min)

3. Create `src/types.ts`:

```typescript
export type SDK = 'mysten' | 'tusky' | 'hibernuts';
export type Framework = 'react' | 'vue' | 'plain-ts';
export type UseCase = 'simple-upload' | 'gallery' | 'defi-nft';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface Context {
  projectName: string;
  projectPath: string;
  sdk: SDK;
  framework: Framework;
  useCase: UseCase;
  analytics: boolean;
  tailwind: boolean;
  packageManager: PackageManager;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string;
}
```

### Step 3: Compatibility Matrix (30 min)

4. Create `src/matrix.ts`:

```typescript
export const COMPATIBILITY_MATRIX = {
  mysten: {
    frameworks: ['react', 'vue', 'plain-ts'],
    useCases: ['simple-upload', 'gallery', 'defi-nft'],
  },
  tusky: {
    frameworks: ['react', 'vue', 'plain-ts'],
    useCases: ['simple-upload', 'gallery'],
  },
  hibernuts: {
    frameworks: ['react', 'plain-ts'],
    useCases: ['simple-upload'],
  },
} as const;

export const SDK_METADATA = {
  mysten: {
    name: '@mysten/walrus',
    description: 'Official Mysten Labs SDK (Testnet stable)',
    docs: 'https://docs.walrus.site',
  },
  tusky: {
    name: '@tusky-io/ts-sdk',
    description: 'Community TypeScript SDK',
    docs: 'https://github.com/tusky-io',
  },
  hibernuts: {
    name: '@hibernuts/walrus-sdk',
    description: 'Alternative Walrus SDK',
    docs: 'https://github.com/hibernuts',
  },
} as const;
```

### Step 4: Validation Logic (45 min)

5. Create `src/validator.ts`:

```typescript
import { Context, ValidationResult } from './types.js';
import { COMPATIBILITY_MATRIX } from './matrix.js';

export function validateContext(context: Context): ValidationResult {
  const { sdk, framework, useCase } = context;

  // Check framework compatibility
  if (!COMPATIBILITY_MATRIX[sdk].frameworks.includes(framework)) {
    return {
      valid: false,
      error: `SDK "${sdk}" is incompatible with framework "${framework}"`,
      suggestion: `Compatible frameworks for ${sdk}: ${COMPATIBILITY_MATRIX[sdk].frameworks.join(', ')}`,
    };
  }

  // Check use case compatibility
  if (!COMPATIBILITY_MATRIX[sdk].useCases.includes(useCase)) {
    return {
      valid: false,
      error: `SDK "${sdk}" does not support use case "${useCase}"`,
      suggestion: `Supported use cases for ${sdk}: ${COMPATIBILITY_MATRIX[sdk].useCases.join(', ')}`,
    };
  }

  return { valid: true };
}

export function validateProjectName(name: string): boolean | string {
  // npm package naming rules
  if (!/^[a-z0-9-]+$/.test(name)) {
    return 'Project name must contain only lowercase letters, numbers, and hyphens';
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    return 'Project name cannot start or end with a hyphen';
  }

  return true;
}
```

### Step 5: Utility Functions (45 min)

6. Create `src/utils/detect-pm.ts`:

```typescript
import { PackageManager } from '../types.js';

export function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent?.includes('pnpm')) return 'pnpm';
  if (userAgent?.includes('yarn')) return 'yarn';
  if (userAgent?.includes('bun')) return 'bun';

  return 'npm';
}
```

7. Create `src/utils/logger.ts`:

```typescript
import kleur from 'kleur';

export const logger = {
  info: (msg: string) => console.log(kleur.blue('ℹ'), msg),
  success: (msg: string) => console.log(kleur.green('✓'), msg),
  error: (msg: string) => console.error(kleur.red('✗'), msg),
  warn: (msg: string) => console.warn(kleur.yellow('⚠'), msg),
};
```

### Step 6: Interactive Prompts (1.5 hours)

8. Create `src/prompts.ts`:

```typescript
import prompts from 'prompts';
import { Context } from './types.js';
import { COMPATIBILITY_MATRIX, SDK_METADATA } from './matrix.js';
import { validateProjectName } from './validator.js';

export async function runPrompts(
  initial: Partial<Context> = {}
): Promise<Partial<Context>> {
  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: initial.projectName || 'my-walrus-app',
      validate: validateProjectName,
    },
    {
      type: 'select',
      name: 'sdk',
      message: 'Choose Walrus SDK:',
      choices: [
        {
          title: `${SDK_METADATA.mysten.name} - ${SDK_METADATA.mysten.description}`,
          value: 'mysten',
        },
        {
          title: `${SDK_METADATA.tusky.name} - ${SDK_METADATA.tusky.description}`,
          value: 'tusky',
        },
        {
          title: `${SDK_METADATA.hibernuts.name} - ${SDK_METADATA.hibernuts.description}`,
          value: 'hibernuts',
        },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'framework',
      message: 'Choose framework:',
      choices: (prev) => {
        const frameworks =
          COMPATIBILITY_MATRIX[prev as keyof typeof COMPATIBILITY_MATRIX]
            .frameworks;
        return frameworks.map((f) => ({
          title:
            f === 'react'
              ? 'React + Vite'
              : f === 'vue'
                ? 'Vue + Vite'
                : 'Plain TypeScript',
          value: f,
        }));
      },
    },
    {
      type: 'select',
      name: 'useCase',
      message: 'Choose use case:',
      choices: (prev, answers) => {
        const useCases =
          COMPATIBILITY_MATRIX[answers.sdk as keyof typeof COMPATIBILITY_MATRIX]
            .useCases;
        return useCases.map((uc) => ({
          title:
            uc === 'simple-upload'
              ? 'Simple Upload (Single file)'
              : uc === 'gallery'
                ? 'File Gallery (Multiple files)'
                : 'DeFi/NFT Metadata',
          value: uc,
        }));
      },
    },
    {
      type: 'confirm',
      name: 'analytics',
      message: 'Include Blockberry analytics?',
      initial: false,
    },
    {
      type: 'confirm',
      name: 'tailwind',
      message: 'Include Tailwind CSS?',
      initial: true,
    },
  ]);

  // Handle Ctrl+C
  if (!response.projectName) {
    console.log('\nOperation cancelled.');
    process.exit(0);
  }

  return response;
}
```

### Step 7: Context Builder (45 min)

9. Create `src/context.ts`:

```typescript
import path from 'node:path';
import { Context } from './types.js';
import { detectPackageManager } from './utils/detect-pm.js';

export function buildContext(
  args: Record<string, unknown>,
  promptResults: Record<string, unknown>
): Context {
  const merged = { ...promptResults, ...args }; // Args override prompts

  const projectName = merged.projectName as string;

  return {
    projectName,
    projectPath: path.resolve(process.cwd(), projectName),
    sdk: merged.sdk as Context['sdk'],
    framework: merged.framework as Context['framework'],
    useCase: merged.useCase as Context['useCase'],
    analytics: Boolean(merged.analytics),
    tailwind: Boolean(merged.tailwind),
    packageManager: detectPackageManager(),
  };
}
```

### Step 8: Main Entry Point (1 hour)

10. Update `src/index.ts`:

```typescript
#!/usr/bin/env node

import { program } from 'commander';
import { runPrompts } from './prompts.js';
import { buildContext } from './context.js';
import { validateContext } from './validator.js';
import { logger } from './utils/logger.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

program
  .name('create-walrus-app')
  .description('Interactive CLI for scaffolding Walrus applications')
  .version(packageJson.version)
  .argument('[project-name]', 'Project directory name')
  .option('--sdk <sdk>', 'SDK to use (mysten | tusky | hibernuts)')
  .option('--framework <framework>', 'Framework (react | vue | plain-ts)')
  .option(
    '--use-case <use-case>',
    'Use case (simple-upload | gallery | defi-nft)'
  )
  .option('--analytics', 'Include Blockberry analytics', false)
  .option('--no-tailwind', 'Exclude Tailwind CSS')
  .action(async (projectNameArg, options) => {
    try {
      logger.info('🚀 Welcome to Walrus Starter Kit!');

      // Build initial context from args
      const initialContext = {
        projectName: projectNameArg,
        ...options,
      };

      // Run interactive prompts (skips questions with provided args)
      const promptResults = await runPrompts(initialContext);

      // Build final context
      const context = buildContext(options, promptResults);

      // Validate compatibility
      const validation = validateContext(context);
      if (!validation.valid) {
        logger.error(validation.error!);
        if (validation.suggestion) {
          logger.info(`💡 ${validation.suggestion}`);
        }
        process.exit(1);
      }

      logger.success('✓ Configuration valid!');
      console.log('\nContext:', context);

      // TODO: Phase 7 - Generate template
      logger.info('🏗️  Template generation coming in Phase 7!');
    } catch (error) {
      logger.error(`Failed to create project: ${error}`);
      process.exit(1);
    }
  });

// Handle cleanup on abort
process.on('SIGINT', () => {
  logger.warn('\n\nOperation cancelled by user.');
  // TODO: Clean up partial state
  process.exit(0);
});

program.parse();
```

## Todo List

- [ ] Add commander, prompts, kleur dependencies
- [ ] Create `types.ts` with interfaces
- [ ] Create `matrix.ts` with compatibility data
- [ ] Create `validator.ts` with validation logic
- [ ] Create `utils/detect-pm.ts`
- [ ] Create `utils/logger.ts`
- [ ] Create `prompts.ts` with 6-step wizard
- [ ] Create `context.ts` with builder function
- [ ] Update `index.ts` with full CLI flow
- [ ] Add abort handler (SIGINT)
- [ ] Test interactive mode
- [ ] Test CLI flag mode
- [ ] Test validation errors
- [ ] Test package manager detection

## Success Criteria

### Functional Tests

- [ ] Interactive mode completes all 6 prompts
- [ ] CLI flags skip corresponding prompts
- [ ] Invalid combinations show clear errors
- [ ] Ctrl+C exits gracefully
- [ ] Package manager detected correctly
- [ ] Project name validation works

### Integration Tests

```bash
# Interactive mode
create-walrus-app

# Non-interactive mode
create-walrus-app my-app --sdk mysten --framework react --use-case simple-upload

# Partial flags (interactive for rest)
create-walrus-app my-app --sdk mysten

# Invalid combination
create-walrus-app test --sdk hibernuts --framework vue --use-case defi-nft
# Should error: hibernuts doesn't support vue
```

### Code Quality

- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] All imports use `.js` extension (ESM)
- [ ] Prompts handle Ctrl+C gracefully

## Risk Assessment

### Potential Blockers

1. **Prompt dependency issues**: `prompts` doesn't work on certain terminals
   - **Mitigation**: Fall back to CLI-only mode, clear docs
2. **Cross-platform paths**: Windows vs Unix path handling
   - **Mitigation**: Use `node:path` everywhere
3. **Package manager detection fails**: Edge case environments
   - **Mitigation**: Default to `npm`, allow override flag

### Contingency Plans

- If prompts fail: Provide clear CLI flag examples
- If validation is too strict: Add `--force` flag (warn only)

## Security Considerations

### Phase-Specific Concerns

1. **Project name injection**: Malicious project names
   - **Hardening**: Strict regex validation
2. **Path traversal**: `../../../etc/passwd` as project name
   - **Hardening**: Reject `..` and absolute paths
3. **Command injection**: Project name used in shell commands
   - **Hardening**: Use programmatic APIs, not shell exec

### Hardening Measures

```typescript
export function validateProjectName(name: string): boolean | string {
  // Prevent path traversal
  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    return 'Project name cannot contain path separators';
  }

  // Prevent absolute paths
  if (path.isAbsolute(name)) {
    return 'Project name cannot be an absolute path';
  }

  // npm naming rules
  if (!/^[a-z0-9-]+$/.test(name)) {
    return 'Project name must contain only lowercase letters, numbers, and hyphens';
  }

  return true;
}
```

## Next Steps

After Phase 2 completion:

1. **Phase 3**: Create Template Base Layer (adapter interface)
2. **Phase 4-6**: Build template layers (SDK, framework, use cases)
3. **Phase 7**: Implement template generation engine (consumes this context)

### Dependencies for Next Phase

Phase 3 requires:

- Context object structure ✅
- SDK compatibility matrix ✅
- Framework choices ✅

### Open Questions

- Should we support yarn PnP? (Decision: No for MVP, too complex)
- Add telemetry for usage analytics? (Decision: No for MVP, privacy first)
- Support custom template URLs? (Decision: Future feature)
````

## File: phase-03-template-base-layer.md

````markdown
# Phase 3: Template Base Layer

## Context Links

- [Main Plan](./plan.md)
- [PRD](../../POC/PRD.md)
- [Mysten Walrus SDK Research](../reports/researcher-260117-1353-mysten-walrus-sdk.md)
- [Next.js App Router Research](../reports/researcher-260117-1353-nextjs-app-router.md)
- [Phase 2: CLI Engine Core](./phase-02-cli-engine-core.md)

## Overview

**Created:** 2026-01-17  
**Priority:** High  
**Status:** pending  
**Estimated Effort:** 5 hours  
**Dependencies:** Phase 2 complete

## Key Insights

### From Research

1. **Adapter Pattern Critical**: SDK-agnostic use case layers require unified interface
2. **Base = Skeleton**: Minimal working structure (TypeScript, env config, base deps)
3. **Layer Composition**: Base + SDK + Framework + UseCase = Full app
4. **Environment Variables**: Standardized `.env.example` for all templates

### Adapter Pattern (From SDK Research)

```typescript
// Universal interface - works with ALL SDKs
interface StorageAdapter {
  upload(file: File | Uint8Array): Promise<string>; // Returns Blob ID
  download(blobId: string): Promise<Uint8Array>;
  getMetadata(blobId: string): Promise<BlobMetadata>;
}
```

This decouples use case code from SDK implementation details.

## Requirements

### Functional

- TypeScript project foundation
- Adapter interface definition
- Base environment configuration
- Common utility functions
- Base package.json structure

### Technical

- TypeScript 5.3+ strict mode
- ESM module system
- Cross-platform compatibility
- Zero framework assumptions (pure TS)

### Dependencies

- Phase 2: CLI context structure

## Architecture

### Base Template Structure

```
templates/base/
├── src/
│   ├── adapters/
│   │   └── storage.ts          # StorageAdapter interface
│   ├── types/
│   │   ├── index.ts            # Common types
│   │   └── walrus.ts           # Walrus-specific types
│   └── utils/
│       ├── env.ts              # Environment validation
│       └── format.ts           # Formatting helpers
├── .env.example                # Template env vars
├── .gitignore
├── package.json                # Base dependencies
├── tsconfig.json               # TypeScript config
└── README.md                   # Base documentation
```

### Adapter Interface Design

```typescript
// templates/base/src/adapters/storage.ts

export interface BlobMetadata {
  blobId: string;
  size: number;
  contentType?: string;
  createdAt: number;
}

export interface UploadOptions {
  epochs?: number;
  contentType?: string;
}

export interface StorageAdapter {
  /**
   * Upload data to Walrus and return Blob ID
   */
  upload(data: File | Uint8Array, options?: UploadOptions): Promise<string>;

  /**
   * Download blob data by ID
   */
  download(blobId: string): Promise<Uint8Array>;

  /**
   * Get blob metadata
   */
  getMetadata(blobId: string): Promise<BlobMetadata>;

  /**
   * Check if blob exists
   */
  exists(blobId: string): Promise<boolean>;
}
```

### Base Types

```typescript
// templates/base/src/types/walrus.ts

export type WalrusNetwork = 'testnet' | 'mainnet';

export interface WalrusConfig {
  network: WalrusNetwork;
  publisherUrl: string;
  aggregatorUrl: string;
  suiRpcUrl: string;
}

export interface BlobInfo {
  blobId: string;
  name: string;
  size: number;
  uploadedAt: number;
}
```

### Environment Configuration

```bash
# templates/base/.env.example

## REQUIRED - Walrus Network
VITE_WALRUS_NETWORK=testnet
VITE_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
VITE_WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space

## REQUIRED - Sui Network
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC=https://fullnode.testnet.sui.io:443

## OPTIONAL - Analytics
VITE_BLOCKBERRY_KEY=
```

### Base package.json

```json
{
  "name": "walrus-app-base",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "echo 'Framework layer will override this'",
    "build": "echo 'Framework layer will override this'",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.19.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0"
  }
}
```

## Related Code Files

### To Create

1. `templates/base/src/adapters/storage.ts` - Adapter interface
2. `templates/base/src/types/index.ts` - Common types
3. `templates/base/src/types/walrus.ts` - Walrus types
4. `templates/base/src/utils/env.ts` - Environment validation
5. `templates/base/src/utils/format.ts` - Formatting helpers
6. `templates/base/.env.example` - Environment template
7. `templates/base/.gitignore` - Git exclusions
8. `templates/base/package.json` - Base dependencies
9. `templates/base/tsconfig.json` - TypeScript config
10. `templates/base/README.md` - Documentation

## Implementation Steps

### Step 1: Create Base Directory (15 min)

1. Create structure:

```bash
cd templates
mkdir -p base/{src/{adapters,types,utils},.vscode}
```

### Step 2: Adapter Interface (45 min)

2. Create `base/src/adapters/storage.ts`:

```typescript
/**
 * Universal storage adapter interface for Walrus
 *
 * This interface abstracts SDK-specific implementations,
 * allowing use case layers to work with any Walrus SDK.
 */

export interface BlobMetadata {
  blobId: string;
  size: number;
  contentType?: string;
  createdAt: number;
  expiresAt?: number;
}

export interface UploadOptions {
  /** Number of epochs to store (Walrus-specific) */
  epochs?: number;
  /** MIME type of the content */
  contentType?: string;
}

export interface DownloadOptions {
  /** Byte range (for large files) */
  range?: { start: number; end: number };
}

export interface StorageAdapter {
  /**
   * Upload data to Walrus storage
   * @param data - File or raw bytes to upload
   * @param options - Upload configuration
   * @returns Blob ID (permanent reference)
   */
  upload(data: File | Uint8Array, options?: UploadOptions): Promise<string>;

  /**
   * Download blob data by ID
   * @param blobId - Unique blob identifier
   * @param options - Download configuration
   * @returns Raw blob data
   */
  download(blobId: string, options?: DownloadOptions): Promise<Uint8Array>;

  /**
   * Get blob metadata without downloading content
   * @param blobId - Unique blob identifier
   * @returns Metadata object
   */
  getMetadata(blobId: string): Promise<BlobMetadata>;

  /**
   * Check if blob exists
   * @param blobId - Unique blob identifier
   * @returns True if blob is accessible
   */
  exists(blobId: string): Promise<boolean>;
}
```

### Step 3: Type Definitions (30 min)

3. Create `base/src/types/walrus.ts`:

```typescript
export type WalrusNetwork = 'testnet' | 'mainnet' | 'devnet';

export interface WalrusConfig {
  network: WalrusNetwork;
  publisherUrl: string;
  aggregatorUrl: string;
  suiRpcUrl: string;
}

export interface BlobInfo {
  blobId: string;
  name?: string;
  size: number;
  contentType?: string;
  uploadedAt: number;
}

export interface StorageStats {
  totalBlobs: number;
  totalSize: number;
  usedEpochs: number;
}
```

4. Create `base/src/types/index.ts`:

```typescript
export * from './walrus.js';

export interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
```

### Step 4: Utility Functions (45 min)

5. Create `base/src/utils/env.ts`:

```typescript
export interface EnvConfig {
  walrusNetwork: string;
  walrusAggregator: string;
  walrusPublisher: string;
  suiNetwork: string;
  suiRpc: string;
  blockberryKey?: string;
}

export function loadEnv(): EnvConfig {
  const getEnv = (key: string, required = true): string => {
    const value = import.meta.env[key];
    if (required && !value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || '';
  };

  return {
    walrusNetwork: getEnv('VITE_WALRUS_NETWORK'),
    walrusAggregator: getEnv('VITE_WALRUS_AGGREGATOR'),
    walrusPublisher: getEnv('VITE_WALRUS_PUBLISHER'),
    suiNetwork: getEnv('VITE_SUI_NETWORK'),
    suiRpc: getEnv('VITE_SUI_RPC'),
    blockberryKey: getEnv('VITE_BLOCKBERRY_KEY', false),
  };
}

export function validateEnv(config: EnvConfig): void {
  if (!['testnet', 'mainnet', 'devnet'].includes(config.walrusNetwork)) {
    throw new Error(`Invalid WALRUS_NETWORK: ${config.walrusNetwork}`);
  }

  if (!config.walrusAggregator.startsWith('http')) {
    throw new Error('WALRUS_AGGREGATOR must be a valid HTTP URL');
  }

  if (!config.walrusPublisher.startsWith('http')) {
    throw new Error('WALRUS_PUBLISHER must be a valid HTTP URL');
  }
}
```

6. Create `base/src/utils/format.ts`:

```typescript
/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format blob ID for display (truncate middle)
 */
export function formatBlobId(blobId: string, length = 12): string {
  if (blobId.length <= length) return blobId;

  const part = Math.floor((length - 3) / 2);
  return `${blobId.slice(0, part)}...${blobId.slice(-part)}`;
}

/**
 * Format timestamp to locale string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
```

### Step 5: Configuration Files (1 hour)

7. Create `base/.env.example`:

```bash
## ==============================================
## Walrus Application - Environment Configuration
## ==============================================

## WALRUS NETWORK SETTINGS
## Network: testnet | mainnet | devnet
VITE_WALRUS_NETWORK=testnet

## Walrus Aggregator URL (for downloads)
VITE_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space

## Walrus Publisher URL (for uploads)
VITE_WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space

## SUI BLOCKCHAIN SETTINGS
## Sui Network: testnet | mainnet | devnet
VITE_SUI_NETWORK=testnet

## Sui RPC URL (for wallet interactions)
VITE_SUI_RPC=https://fullnode.testnet.sui.io:443

## OPTIONAL FEATURES
## Blockberry Analytics API Key (leave empty to disable)
VITE_BLOCKBERRY_KEY=

## ==============================================
## PREREQUISITES
## ==============================================
## 1. Install Sui Wallet browser extension
## 2. Get testnet SUI from faucet: https://faucet.testnet.sui.io/
## 3. Copy this file to .env and fill in any optional values
```

8. Create `base/.gitignore`:

```
# Dependencies
node_modules/
.pnpm-debug.log

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Test
coverage/
```

9. Create `base/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

10. Create `base/package.json`:

```json
{
  "name": "walrus-app-base",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "echo 'Override by framework layer'",
    "build": "echo 'Override by framework layer'",
    "preview": "echo 'Override by framework layer'",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.19.1",
    "@typescript-eslint/eslint-plugin": "^6.19.1"
  }
}
```

### Step 6: Documentation (45 min)

11. Create `base/README.md`:

```markdown
# Walrus Application Base Layer

This is the **foundation layer** for all Walrus applications generated by `create-walrus-app`.

## What's Included

### Adapter Interface

- `src/adapters/storage.ts` - Universal SDK-agnostic interface
- Allows use case code to work with any Walrus SDK

### Type Definitions

- `src/types/walrus.ts` - Walrus-specific types
- `src/types/index.ts` - Common utility types

### Utilities

- `src/utils/env.ts` - Environment validation
- `src/utils/format.ts` - Formatting helpers

### Configuration

- `.env.example` - Environment template
- `tsconfig.json` - TypeScript strict mode config
- `package.json` - Base dependencies

## Layer Composition

This base layer is **always included** and combined with:

1. **SDK Layer** (e.g., `sdk-mysten/`) - Implements `StorageAdapter`
2. **Framework Layer** (e.g., `react/`) - UI framework setup
3. **Use Case Layer** (e.g., `simple-upload/`) - Application logic
```

Base + SDK + Framework + UseCase = Your App

```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in required values:
   - Walrus network URLs
   - Sui RPC endpoint
3. Optional: Add Blockberry API key

## Next Steps

This base layer is completed by:
- **Phase 4**: SDK implementation
- **Phase 5**: Framework setup
- **Phase 6**: Use case logic
```

### Step 7: Validation (30 min)

12. Create test script to validate base layer:

```bash
# In packages/cli/src/test-base.ts (temporary)
import fs from 'fs-extra';
import path from 'node:path';

const basePath = path.join(process.cwd(), '../../templates/base');

// Check all required files exist
const requiredFiles = [
  'src/adapters/storage.ts',
  'src/types/walrus.ts',
  'src/types/index.ts',
  'src/utils/env.ts',
  'src/utils/format.ts',
  '.env.example',
  '.gitignore',
  'package.json',
  'tsconfig.json',
  'README.md'
];

for (const file of requiredFiles) {
  const fullPath = path.join(basePath, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

console.log('✓ Base layer validation passed!');
```

## Todo List

- [ ] Create `templates/base/` directory structure
- [ ] Write `src/adapters/storage.ts` interface
- [ ] Write `src/types/walrus.ts` types
- [ ] Write `src/types/index.ts` exports
- [ ] Write `src/utils/env.ts` validation
- [ ] Write `src/utils/format.ts` helpers
- [ ] Write `.env.example` template
- [ ] Write `.gitignore` rules
- [ ] Write `tsconfig.json` config
- [ ] Write `package.json` base deps
- [ ] Write `README.md` documentation
- [ ] Create validation test script
- [ ] Run validation tests

## Success Criteria

### Structural Tests

- [ ] All 10 required files exist
- [ ] Directory structure matches spec
- [ ] TypeScript files have valid syntax
- [ ] JSON files parse correctly

### Interface Tests

- [ ] `StorageAdapter` has all required methods
- [ ] Type exports work correctly
- [ ] Utility functions are importable

### Documentation Tests

- [ ] `.env.example` has all required variables
- [ ] README explains layer composition
- [ ] Comments explain adapter pattern

### Integration Tests

```typescript
// Test that adapter can be imported
import type { StorageAdapter } from './templates/base/src/adapters/storage.js';

// Test that types work
import type { WalrusConfig } from './templates/base/src/types/walrus.js';

// Test utilities
import { formatBytes, loadEnv } from './templates/base/src/utils';
```

## Risk Assessment

### Potential Blockers

1. **Interface too rigid**: Doesn't accommodate all SDKs
   - **Mitigation**: Design based on common denominator of 3 SDKs
2. **Type conflicts**: SDK types don't match base types
   - **Mitigation**: Use adapter pattern to translate
3. **Environment validation fails**: Different SDK requirements
   - **Mitigation**: Make validation overridable per SDK

### Contingency Plans

- If adapter interface insufficient: Add optional methods
- If env validation conflicts: Move to SDK layer

## Security Considerations

### Phase-Specific Concerns

1. **Environment variable exposure**: Secrets in `.env`
   - **Hardening**: Clear docs on VITE\_ prefix (public vars)
2. **Type validation**: Runtime type safety
   - **Hardening**: Use Zod or similar for runtime validation (future)

### Best Practices

- Never commit `.env` files
- Use `VITE_` prefix for public vars (Vite convention)
- Validate all environment variables at startup
- Provide clear error messages for missing config

## Next Steps

After Phase 3 completion:

1. **Phase 4**: Implement @mysten/walrus SDK layer (implements `StorageAdapter`)
2. **Phase 5**: Create React framework layer
3. **Phase 6**: Build use case templates (consume adapter)

### Dependencies for Next Phase

Phase 4 requires:

- `StorageAdapter` interface ✅
- Walrus types ✅
- Environment structure ✅

### Open Questions

- Should we add logger interface to base? (Decision: Yes, add in Phase 4)
- Support for custom adapters? (Decision: Yes, document pattern)
````

## File: phase-04-sdk-layer.md

````markdown
# Phase 4: SDK Layer (@mysten/walrus)

## Context Links

- [Main Plan](./plan.md)
- [PRD](../../POC/PRD.md)
- [Mysten Walrus SDK Research](../reports/researcher-260117-1353-mysten-walrus-sdk.md)
- [Phase 3: Template Base Layer](./phase-03-template-base-layer.md)

## Overview

**Created:** 2026-01-17  
**Priority:** High  
**Status:** pending  
**Estimated Effort:** 6 hours  
**Dependencies:** Phase 3 complete

## Key Insights

### From Research

1. **Relay Upload Pattern**: Use `writeBlobToUploadRelay()` for browser clients (avoids heavy encoding)
2. **Direct Download**: `readBlob(blobId)` returns `Uint8Array`
3. **Metadata Fetching**: `getBlobMetadata()` for size/encoding info
4. **Transaction Pattern**: Register blob requires signing (Build → Sign → Execute)
5. **HTTP Gateway**: Blobs accessible via `https://aggregator.../v1/{blobId}` for simple retrieval

### Critical API Pattern

```typescript
// Upload via relay (browser-friendly)
const result = await walrus.writeBlobToUploadRelay(dataUInt8Array, {
  nEpochs: 1,
});
const blobId = result.newlyCreated.blobObject.blobId;

// Download
const data = await walrus.readBlob(blobId);
```

## Requirements

### Functional

- Implement `StorageAdapter` interface from Phase 3
- Walrus client initialization
- Upload via relay (browser-optimized)
- Download blob data
- Metadata retrieval
- Error handling for network failures

### Technical

- `@mysten/walrus` v0.6.7+ integration
- `@mysten/sui` peer dependency
- TypeScript type safety
- Cross-network support (testnet/mainnet)

### Dependencies

- Phase 3: `StorageAdapter` interface

## Architecture

### SDK Layer Structure

```
templates/sdk-mysten/
├── src/
│   ├── client.ts               # WalrusClient singleton
│   ├── adapter.ts              # StorageAdapter implementation
│   ├── config.ts               # SDK configuration
│   └── types.ts                # Mysten-specific types
├── package.json                # @mysten/walrus dependencies
└── README.md                   # SDK-specific docs
```

### Client Initialization Pattern

```typescript
// templates/sdk-mysten/src/client.ts

import { WalrusClient } from '@mysten/walrus';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { loadEnv } from '../../base/src/utils/env.js';

let walrusClient: WalrusClient | null = null;

export function getWalrusClient(): WalrusClient {
  if (walrusClient) return walrusClient;

  const env = loadEnv();

  const suiClient = new SuiClient({
    url: env.suiRpc || getFullnodeUrl(env.suiNetwork as 'testnet' | 'mainnet'),
  });

  walrusClient = new WalrusClient({
    network: env.walrusNetwork as 'testnet' | 'mainnet',
    suiClient,
  });

  return walrusClient;
}
```

### Adapter Implementation

```typescript
// templates/sdk-mysten/src/adapter.ts

import type {
  StorageAdapter,
  BlobMetadata,
  UploadOptions,
} from '../../base/src/adapters/storage.js';
import { getWalrusClient } from './client.js';

export const mystenAdapter: StorageAdapter = {
  async upload(
    data: File | Uint8Array,
    options?: UploadOptions
  ): Promise<string> {
    const client = getWalrusClient();

    // Convert File to Uint8Array if needed
    const bytes =
      data instanceof File ? new Uint8Array(await data.arrayBuffer()) : data;

    // Use relay upload (browser-optimized)
    const result = await client.writeBlobToUploadRelay(bytes, {
      nEpochs: options?.epochs || 1,
    });

    return result.newlyCreated.blobObject.blobId;
  },

  async download(blobId: string): Promise<Uint8Array> {
    const client = getWalrusClient();
    return await client.readBlob(blobId);
  },

  async getMetadata(blobId: string): Promise<BlobMetadata> {
    const client = getWalrusClient();
    const metadata = await client.getBlobMetadata(blobId);

    return {
      blobId,
      size: metadata.size,
      contentType: metadata.contentType,
      createdAt: metadata.createdAt || Date.now(),
    };
  },

  async exists(blobId: string): Promise<boolean> {
    try {
      await this.getMetadata(blobId);
      return true;
    } catch {
      return false;
    }
  },
};
```

### Package Dependencies

```json
{
  "dependencies": {
    "@mysten/walrus": "^1.0.0",
    "@mysten/sui": "^1.10.0"
  }
}
```

## Related Code Files

### To Create

1. `templates/sdk-mysten/src/client.ts` - WalrusClient singleton
2. `templates/sdk-mysten/src/adapter.ts` - StorageAdapter implementation
3. `templates/sdk-mysten/src/config.ts` - Configuration helpers
4. `templates/sdk-mysten/src/types.ts` - Mysten-specific types
5. `templates/sdk-mysten/src/index.ts` - Public exports
6. `templates/sdk-mysten/package.json` - Dependencies
7. `templates/sdk-mysten/README.md` - Documentation

## Implementation Steps

### Step 1: Create SDK Directory (15 min)

1. Create structure:

```bash
cd templates
mkdir -p sdk-mysten/src
```

### Step 2: Configuration Layer (45 min)

2. Create `sdk-mysten/src/config.ts`:

```typescript
import type { WalrusNetwork } from '../../base/src/types/walrus.js';

export interface MystenWalrusConfig {
  network: WalrusNetwork;
  publisherUrl?: string;
  aggregatorUrl?: string;
  suiRpcUrl?: string;
}

export const NETWORK_CONFIGS: Record<WalrusNetwork, MystenWalrusConfig> = {
  testnet: {
    network: 'testnet',
    publisherUrl: 'https://publisher.walrus-testnet.walrus.space',
    aggregatorUrl: 'https://aggregator.walrus-testnet.walrus.space',
    suiRpcUrl: 'https://fullnode.testnet.sui.io:443',
  },
  mainnet: {
    network: 'mainnet',
    publisherUrl: 'https://publisher.walrus.space',
    aggregatorUrl: 'https://aggregator.walrus.space',
    suiRpcUrl: 'https://fullnode.mainnet.sui.io:443',
  },
  devnet: {
    network: 'devnet',
    publisherUrl: 'http://localhost:8080',
    aggregatorUrl: 'http://localhost:8081',
    suiRpcUrl: 'http://localhost:9000',
  },
};

export function getNetworkConfig(network: WalrusNetwork): MystenWalrusConfig {
  return NETWORK_CONFIGS[network];
}
```

3. Create `sdk-mysten/src/types.ts`:

```typescript
/**
 * Mysten-specific type extensions
 */

export interface MystenUploadResult {
  newlyCreated: {
    blobObject: {
      blobId: string;
      size: number;
    };
  };
}

export interface MystenBlobMetadata {
  size: number;
  encodingType: string;
  contentType?: string;
  createdAt?: number;
}
```

### Step 3: Client Singleton (1 hour)

4. Create `sdk-mysten/src/client.ts`:

```typescript
import { WalrusClient } from '@mysten/walrus';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { loadEnv } from '../../base/src/utils/env.js';
import { getNetworkConfig } from './config.js';
import type { WalrusNetwork } from '../../base/src/types/walrus.js';

/**
 * Global WalrusClient singleton
 * Initialized lazily on first use
 */
let walrusClient: WalrusClient | null = null;

/**
 * Get or create WalrusClient instance
 */
export function getWalrusClient(): WalrusClient {
  if (walrusClient) {
    return walrusClient;
  }

  const env = loadEnv();
  const network = env.walrusNetwork as WalrusNetwork;
  const config = getNetworkConfig(network);

  // Initialize Sui client
  const suiClient = new SuiClient({
    url:
      env.suiRpc ||
      config.suiRpcUrl ||
      getFullnodeUrl(network === 'testnet' ? 'testnet' : 'mainnet'),
  });

  // Initialize Walrus client
  walrusClient = new WalrusClient({
    network: network === 'testnet' ? 'testnet' : 'mainnet',
    suiClient,
    // Optional custom endpoints
    ...(env.walrusPublisher && { publisherUrl: env.walrusPublisher }),
    ...(env.walrusAggregator && { aggregatorUrl: env.walrusAggregator }),
  });

  return walrusClient;
}

/**
 * Reset client (useful for testing or network switching)
 */
export function resetWalrusClient(): void {
  walrusClient = null;
}
```

### Step 4: Adapter Implementation (1.5 hours)

5. Create `sdk-mysten/src/adapter.ts`:

```typescript
import type {
  StorageAdapter,
  BlobMetadata,
  UploadOptions,
  DownloadOptions,
} from '../../base/src/adapters/storage.js';
import { getWalrusClient } from './client.js';

/**
 * Mysten Walrus SDK implementation of StorageAdapter
 */
export class MystenStorageAdapter implements StorageAdapter {
  async upload(
    data: File | Uint8Array,
    options?: UploadOptions
  ): Promise<string> {
    const client = getWalrusClient();

    // Convert File to Uint8Array
    const bytes =
      data instanceof File ? new Uint8Array(await data.arrayBuffer()) : data;

    try {
      // Use relay upload for browser optimization
      // Relay handles erasure encoding/encryption
      const result = await client.writeBlobToUploadRelay(bytes, {
        nEpochs: options?.epochs || 1,
      });

      // Extract blob ID from response
      const blobId = result.newlyCreated.blobObject.blobId;

      return blobId;
    } catch (error) {
      throw new Error(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async download(
    blobId: string,
    options?: DownloadOptions
  ): Promise<Uint8Array> {
    const client = getWalrusClient();

    try {
      // Range download not supported by SDK yet
      // Future: implement range requests via HTTP gateway
      const data = await client.readBlob(blobId);

      return data;
    } catch (error) {
      throw new Error(
        `Download failed for blob ${blobId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getMetadata(blobId: string): Promise<BlobMetadata> {
    const client = getWalrusClient();

    try {
      const metadata = await client.getBlobMetadata(blobId);

      return {
        blobId,
        size: metadata.size,
        contentType: metadata.contentType,
        createdAt: metadata.createdAt || Date.now(),
      };
    } catch (error) {
      throw new Error(
        `Failed to get metadata for blob ${blobId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async exists(blobId: string): Promise<boolean> {
    try {
      await this.getMetadata(blobId);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Singleton adapter instance
 */
export const storageAdapter = new MystenStorageAdapter();
```

### Step 5: Public Exports (30 min)

6. Create `sdk-mysten/src/index.ts`:

```typescript
/**
 * @mysten/walrus SDK Layer
 *
 * Implements the StorageAdapter interface using Mysten's official SDK
 */

export { getWalrusClient, resetWalrusClient } from './client.js';
export { MystenStorageAdapter, storageAdapter } from './adapter.js';
export { getNetworkConfig, NETWORK_CONFIGS } from './config.js';
export type { MystenUploadResult, MystenBlobMetadata } from './types.js';

// Re-export base types for convenience
export type {
  StorageAdapter,
  BlobMetadata,
  UploadOptions,
  DownloadOptions,
} from '../../base/src/adapters/storage.js';
```

### Step 6: Package Configuration (30 min)

7. Create `sdk-mysten/package.json`:

```json
{
  "name": "walrus-app-sdk-mysten",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Mysten Walrus SDK layer for walrus-starter-kit",
  "dependencies": {
    "@mysten/walrus": "^1.0.0",
    "@mysten/sui": "^1.10.0"
  },
  "peerDependencies": {
    "typescript": "^5.3.0"
  }
}
```

### Step 7: Documentation (45 min)

8. Create `sdk-mysten/README.md`:

````markdown
# Mysten Walrus SDK Layer

Official [Mysten Labs](https://mystenlabs.com/) SDK implementation for Walrus storage.

## Features

✅ **Relay Upload** - Browser-optimized uploads via relay nodes  
✅ **Direct Download** - Fast blob retrieval  
✅ **Metadata Queries** - Size, type, creation date  
✅ **Network Support** - Testnet, Mainnet, Devnet  
✅ **Type Safety** - Full TypeScript support

## Usage

```typescript
import { storageAdapter } from './sdk-mysten';

// Upload file
const blobId = await storageAdapter.upload(fileData, { epochs: 1 });

// Download file
const data = await storageAdapter.download(blobId);

// Get metadata
const metadata = await storageAdapter.getMetadata(blobId);
console.log(`Blob size: ${metadata.size} bytes`);
```
````

## Configuration

Set environment variables:

```bash
VITE_WALRUS_NETWORK=testnet
VITE_WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space
VITE_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
VITE_SUI_RPC=https://fullnode.testnet.sui.io:443
```

## API Reference

### `storageAdapter`

Singleton instance implementing `StorageAdapter` interface.

### `getWalrusClient()`

Get WalrusClient singleton (lazy initialization).

### `getNetworkConfig(network)`

Get network-specific configuration.

## Network Defaults

| Network | Publisher                                       | Aggregator                                       |
| ------- | ----------------------------------------------- | ------------------------------------------------ |
| testnet | `https://publisher.walrus-testnet.walrus.space` | `https://aggregator.walrus-testnet.walrus.space` |
| mainnet | `https://publisher.walrus.space`                | `https://aggregator.walrus.space`                |

## Resources

- [Walrus SDK Docs](https://sdk.mystenlabs.com/walrus)
- [Walrus Documentation](https://docs.walrus.site)
- [npm: @mysten/walrus](https://www.npmjs.com/package/@mysten/walrus)

````

### Step 8: Testing (1 hour)

9. Create test file `sdk-mysten/test/adapter.test.ts` (for validation):
```typescript
import { describe, it, expect } from 'vitest';
import { MystenStorageAdapter } from '../src/adapter.js';

describe('MystenStorageAdapter', () => {
  it('should implement StorageAdapter interface', () => {
    const adapter = new MystenStorageAdapter();

    expect(adapter).toHaveProperty('upload');
    expect(adapter).toHaveProperty('download');
    expect(adapter).toHaveProperty('getMetadata');
    expect(adapter).toHaveProperty('exists');
  });

  it('should handle upload errors gracefully', async () => {
    const adapter = new MystenStorageAdapter();
    const invalidData = new Uint8Array(0);

    await expect(
      adapter.upload(invalidData)
    ).rejects.toThrow('Upload failed');
  });
});
````

## Todo List

- [ ] Create `templates/sdk-mysten/src/` directory
- [ ] Write `config.ts` with network presets
- [ ] Write `types.ts` with Mysten-specific types
- [ ] Write `client.ts` with singleton pattern
- [ ] Write `adapter.ts` implementing StorageAdapter
- [ ] Write `index.ts` with public exports
- [ ] Write `package.json` with dependencies
- [ ] Write `README.md` documentation
- [ ] Create test file for validation
- [ ] Test adapter methods manually

## Success Criteria

### Functional Tests

- [ ] Upload returns valid blob ID (64-char hex)
- [ ] Download retrieves correct data
- [ ] Metadata returns size/type
- [ ] Exists check works for valid/invalid IDs
- [ ] Errors throw with clear messages

### Integration Tests

```typescript
// Test full upload-download cycle
const testData = new TextEncoder().encode('Hello Walrus');
const blobId = await storageAdapter.upload(testData);
const retrieved = await storageAdapter.download(blobId);

expect(new TextDecoder().decode(retrieved)).toBe('Hello Walrus');
```

### Type Safety Tests

- [ ] TypeScript compilation passes strict mode
- [ ] All imports resolve correctly
- [ ] Adapter implements full `StorageAdapter` interface

## Risk Assessment

### Potential Blockers

1. **@mysten/walrus API changes**: SDK updates break implementation
   - **Mitigation**: Pin exact version, monitor releases
2. **Network timeouts**: Relay uploads fail
   - **Mitigation**: Implement retry logic with exponential backoff
3. **Blob ID format changes**: Different encoding
   - **Mitigation**: Type validation on blob ID

### Contingency Plans

- If relay fails: Add fallback to direct upload (heavier but works)
- If metadata unavailable: Use HTTP gateway for size checks

## Security Considerations

### Phase-Specific Concerns

1. **Blob ID validation**: Prevent injection attacks
   - **Hardening**: Validate blob ID format (hex string)
2. **Large file uploads**: DoS via huge files
   - **Hardening**: Add size limits (e.g., 10MB for browser)
3. **Network configuration**: Malicious publisher URL
   - **Hardening**: Validate URLs (HTTPS only)

### Hardening Measures

```typescript
function validateBlobId(blobId: string): void {
  if (!/^[a-f0-9]{64}$/.test(blobId)) {
    throw new Error('Invalid blob ID format');
  }
}

function validateFileSize(data: Uint8Array, maxSize = 10 * 1024 * 1024): void {
  if (data.byteLength > maxSize) {
    throw new Error(
      `File too large: ${data.byteLength} bytes (max: ${maxSize})`
    );
  }
}
```

## Next Steps

After Phase 4 completion:

1. **Phase 5**: Create React framework layer (uses this adapter)
2. **Phase 6**: Build use case templates (consume adapter)
3. **Future**: Add Tusky + Hibernuts SDK layers (same interface)

### Dependencies for Next Phase

Phase 5 requires:

- Working `storageAdapter` ✅
- `getWalrusClient()` for advanced features ✅
- Type definitions ✅

### Open Questions

- Should we support direct upload as fallback? (Decision: Yes, add option)
- Add retry logic for network failures? (Decision: Yes, exponential backoff)
- Support streaming downloads? (Decision: Future feature)
````

## File: phase-05-framework-layer.md

````markdown
# Phase 5: Framework Layer (React+Vite)

## Context Links

- [Main Plan](./plan.md)
- [PRD](../../POC/PRD.md)
- [Next.js App Router Research](../reports/researcher-260117-1353-nextjs-app-router.md)
- [Phase 4: SDK Layer](./phase-04-sdk-layer.md)

## Overview

**Created:** 2026-01-17  
**Priority:** High  
**Status:** pending  
**Estimated Effort:** 6 hours  
**Dependencies:** Phase 3, Phase 4 complete

## Key Insights

### From Research (Adapted for Vite)

1. **Client Components**: All Walrus interactions are client-side (browser uploads)
2. **Wallet Integration**: `@mysten/dapp-kit` for Sui wallet connections
3. **Code Splitting**: Lazy load heavy SDK components
4. **Suspense Pattern**: Loading states for async operations
5. **Direct Uploads**: Never proxy files through backend

### Why Vite Over Next.js (MVP Decision)

- **Simpler**: No SSR complexity for file upload use case
- **Faster Dev**: Instant HMR, lighter build
- **Better DX**: Straightforward SPA model for client-heavy apps
- **Future**: Can add Next.js layer later

## Requirements

### Functional

- React 18+ with hooks
- Vite dev server + build system
- TanStack Query for async state
- @mysten/dapp-kit for wallet
- Component architecture for use cases

### Technical

- TypeScript strict mode
- ESLint + Prettier
- CSS Modules or Tailwind (conditional)
- Fast Refresh (HMR)

### Dependencies

- Phase 3: Base utilities
- Phase 4: StorageAdapter implementation

## Architecture

### Framework Layer Structure

```
templates/react/
├── public/
│   └── vite.svg                # Vite logo
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # App shell
│   │   └── WalletConnect.tsx   # Wallet button
│   ├── providers/
│   │   ├── QueryProvider.tsx   # TanStack Query wrapper
│   │   └── WalletProvider.tsx  # @mysten/dapp-kit wrapper
│   ├── hooks/
│   │   ├── useStorage.ts       # Storage adapter hook
│   │   └── useWallet.ts        # Wallet state hook
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── package.json                # React dependencies
└── README.md                   # Framework docs
```

### Provider Pattern

```typescript
// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Custom Hook Pattern

```typescript
// src/hooks/useStorage.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { storageAdapter } from '../../../sdk-mysten/src/index.js';

export function useUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      return await storageAdapter.upload(file, { epochs: 1 });
    },
  });
}

export function useDownload(blobId: string) {
  return useQuery({
    queryKey: ['blob', blobId],
    queryFn: () => storageAdapter.download(blobId),
    enabled: !!blobId,
  });
}
```

## Related Code Files

### To Create

1. `templates/react/index.html` - HTML template
2. `templates/react/src/main.tsx` - Entry point
3. `templates/react/src/App.tsx` - Root component
4. `templates/react/src/index.css` - Global styles
5. `templates/react/src/components/Layout.tsx` - App shell
6. `templates/react/src/components/WalletConnect.tsx` - Wallet button
7. `templates/react/src/providers/QueryProvider.tsx` - TanStack Query
8. `templates/react/src/providers/WalletProvider.tsx` - dApp Kit
9. `templates/react/src/hooks/useStorage.ts` - Storage hook
10. `templates/react/src/hooks/useWallet.ts` - Wallet hook
11. `templates/react/vite.config.ts` - Vite config
12. `templates/react/package.json` - Dependencies
13. `templates/react/README.md` - Documentation

## Implementation Steps

### Step 1: Create React Directory (15 min)

1. Create structure:

```bash
cd templates
mkdir -p react/{public,src/{components,providers,hooks}}
```

### Step 2: HTML Template (15 min)

2. Create `react/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Walrus App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 3: Entry Point (30 min)

3. Create `react/src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from './providers/QueryProvider.js';
import { WalletProvider } from './providers/WalletProvider.js';
import App from './App.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </QueryProvider>
  </React.StrictMode>
);
```

4. Create `react/src/index.css`:

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
```

### Step 4: Provider Setup (1 hour)

5. Create `react/src/providers/QueryProvider.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

6. Create `react/src/providers/WalletProvider.tsx`:

```typescript
import { createNetworkConfig, SuiClientProvider, WalletProvider as SuiWalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { loadEnv } from '../../../base/src/utils/env.js';

const env = loadEnv();

// Sui network configuration
const { networkConfig } = createNetworkConfig({
  [env.suiNetwork]: {
    url: env.suiRpc || getFullnodeUrl(env.suiNetwork as 'testnet' | 'mainnet')
  }
});

const walletQueryClient = new QueryClient();

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={walletQueryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={env.suiNetwork as 'testnet' | 'mainnet'}>
        <SuiWalletProvider>
          {children}
        </SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
```

### Step 5: Custom Hooks (1.5 hours)

7. Create `react/src/hooks/useStorage.ts`:

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { storageAdapter } from '../../../sdk-mysten/src/index.js';
import type { UploadOptions } from '../../../base/src/adapters/storage.js';

/**
 * Hook for uploading files to Walrus
 */
export function useUpload() {
  return useMutation({
    mutationFn: async ({
      file,
      options,
    }: {
      file: File;
      options?: UploadOptions;
    }) => {
      const blobId = await storageAdapter.upload(file, options);
      return { blobId, file };
    },
    onSuccess: (data) => {
      console.log('Upload successful:', data.blobId);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });
}

/**
 * Hook for downloading blob data
 */
export function useDownload(blobId: string | null) {
  return useQuery({
    queryKey: ['blob', blobId],
    queryFn: async () => {
      if (!blobId) throw new Error('No blob ID provided');
      return await storageAdapter.download(blobId);
    },
    enabled: !!blobId,
  });
}

/**
 * Hook for fetching blob metadata
 */
export function useMetadata(blobId: string | null) {
  return useQuery({
    queryKey: ['metadata', blobId],
    queryFn: async () => {
      if (!blobId) throw new Error('No blob ID provided');
      return await storageAdapter.getMetadata(blobId);
    },
    enabled: !!blobId,
  });
}
```

8. Create `react/src/hooks/useWallet.ts`:

```typescript
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';

/**
 * Hook for wallet state and actions
 */
export function useWallet() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  return {
    account: currentAccount,
    isConnected: !!currentAccount,
    address: currentAccount?.address,
    signAndExecute,
  };
}
```

### Step 6: Components (1 hour)

9. Create `react/src/components/Layout.tsx`:

```typescript
import { ReactNode } from 'react';
import { WalletConnect } from './WalletConnect.js';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>🌊 Walrus App</h1>
        <WalletConnect />
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>Powered by Walrus & Sui</p>
      </footer>
    </div>
  );
}
```

10. Create `react/src/components/WalletConnect.tsx`:

```typescript
import { ConnectButton } from '@mysten/dapp-kit';
import { useWallet } from '../hooks/useWallet.js';

export function WalletConnect() {
  const { isConnected, address } = useWallet();

  return (
    <div className="wallet-connect">
      {isConnected ? (
        <div className="wallet-info">
          <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
        </div>
      ) : (
        <p>Please connect your wallet</p>
      )}
      <ConnectButton />
    </div>
  );
}
```

11. Create `react/src/App.tsx`:

```typescript
import { Layout } from './components/Layout.js';

function App() {
  return (
    <Layout>
      <div className="welcome">
        <h2>Welcome to Walrus Starter Kit</h2>
        <p>This app will be customized by the use case layer</p>
      </div>
    </Layout>
  );
}

export default App;
```

### Step 7: Vite Configuration (45 min)

12. Create `react/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

### Step 8: Package Configuration (30 min)

13. Create `react/package.json`:

```json
{
  "name": "walrus-app-react",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.17.0",
    "@mysten/dapp-kit": "^0.14.0",
    "@mysten/sui": "^1.10.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.11",
    "typescript": "^5.3.3"
  }
}
```

### Step 9: Documentation (30 min)

14. Create `react/README.md`:

```markdown
# React + Vite Framework Layer

Modern React 18 application with Vite build system.

## Features

✅ **React 18** - Hooks, Suspense, Concurrent features  
✅ **Vite 5** - Lightning-fast HMR and builds  
✅ **TanStack Query** - Async state management  
✅ **@mysten/dapp-kit** - Sui wallet integration  
✅ **TypeScript** - Full type safety

## Project Structure
```

src/
├── components/ # Reusable UI components
├── providers/ # Context providers
├── hooks/ # Custom React hooks
├── App.tsx # Root component
└── main.tsx # Entry point

````

## Custom Hooks

### `useUpload()`
Upload files to Walrus:
```typescript
const upload = useUpload();

upload.mutate({ file: myFile, options: { epochs: 1 } });
````

### `useDownload(blobId)`

Download blob data:

```typescript
const { data, isLoading } = useDownload(blobId);
```

### `useMetadata(blobId)`

Fetch blob metadata:

```typescript
const { data: metadata } = useMetadata(blobId);
console.log(`Size: ${metadata.size} bytes`);
```

### `useWallet()`

Access wallet state:

```typescript
const { isConnected, address } = useWallet();
```

## Development

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Build for production
npm run preview    # Preview production build
```

## Wallet Setup

1. Install Sui Wallet browser extension
2. Get testnet SUI from faucet
3. Connect wallet in the app

## Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TanStack Query](https://tanstack.com/query)
- [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit)

````

## Todo List

- [ ] Create `templates/react/` structure
- [ ] Write `index.html` template
- [ ] Write `src/main.tsx` entry
- [ ] Write `src/App.tsx` root component
- [ ] Write `src/index.css` global styles
- [ ] Write `providers/QueryProvider.tsx`
- [ ] Write `providers/WalletProvider.tsx`
- [ ] Write `hooks/useStorage.ts`
- [ ] Write `hooks/useWallet.ts`
- [ ] Write `components/Layout.tsx`
- [ ] Write `components/WalletConnect.tsx`
- [ ] Write `vite.config.ts`
- [ ] Write `package.json` with deps
- [ ] Write `README.md` docs

## Success Criteria

### Functional Tests
- [ ] Dev server starts on `npm run dev`
- [ ] App renders without errors
- [ ] Wallet connection works
- [ ] Upload hook triggers mutations
- [ ] Download hook fetches data
- [ ] TypeScript compilation passes

### Integration Tests
```bash
cd templates/react
npm install
npm run dev
# Should open http://localhost:3000
# Should show "Welcome to Walrus Starter Kit"
# Should show wallet connect button
````

### Code Quality

- [ ] ESLint passes
- [ ] TypeScript strict mode passes
- [ ] Fast Refresh works (HMR)
- [ ] Build completes successfully

## Risk Assessment

### Potential Blockers

1. **Wallet provider conflicts**: Multiple QueryClient instances
   - **Mitigation**: Separate QueryClient for wallet vs app
2. **Vite env var issues**: `import.meta.env` not working
   - **Mitigation**: Use VITE\_ prefix, check vite.config.ts
3. **SDK bundle size**: Large initial load
   - **Mitigation**: Code splitting, lazy loading

### Contingency Plans

- If dapp-kit fails: Use direct @mysten/sui integration
- If TanStack Query overhead: Use plain React state for MVP

## Security Considerations

### Phase-Specific Concerns

1. **XSS via file uploads**: Malicious file content
   - **Hardening**: Content-type validation, sandboxed previews
2. **Wallet permissions**: Over-requesting permissions
   - **Hardening**: Request only necessary permissions
3. **Environment exposure**: Leaking secrets in client
   - **Hardening**: Only VITE\_ prefixed vars, no secrets in client

## Next Steps

After Phase 5 completion:

1. **Phase 6**: Build use case layers (consume these hooks/components)
2. **Phase 7**: Implement template generation (compose layers)
3. **Future**: Add Vue framework layer (same pattern)

### Dependencies for Next Phase

Phase 6 requires:

- `useUpload()`, `useDownload()` hooks ✅
- `Layout`, `WalletConnect` components ✅
- Wallet provider setup ✅

### Open Questions

- Add React Router for multi-page apps? (Decision: Use case layer decides)
- Support class components? (Decision: No, hooks only for MVP)
````

## File: phase-06-use-case-layers.md

````markdown
# Phase 6: Use Case Layers

## Context Links

- [Main Plan](./plan.md)
- [PRD](../../POC/PRD.md)
- [Phase 3: Template Base Layer](./phase-03-template-base-layer.md)
- [Phase 4: SDK Layer](./phase-04-sdk-layer.md)
- [Phase 5: Framework Layer](./phase-05-framework-layer.md)

## Overview

**Created:** 2026-01-17  
**Priority:** High  
**Status:** pending  
**Estimated Effort:** 8 hours  
**Dependencies:** Phase 3, 4, 5 complete

## Key Insights

### Use Case Strategy

1. **Simple Upload** - Single file upload/download (MVP priority)
2. **File Gallery** - Multiple file management with index
3. **DeFi/NFT Metadata** - JSON metadata storage for NFTs

Each use case is a **complete working application** that combines:

- Base utilities
- SDK adapter
- Framework components
- Use case-specific UI and logic

## Requirements

### Functional

- Three complete use case templates
- File upload/download UI
- Gallery index management
- NFT metadata schema
- Loading/error states
- Success feedback

### Technical

- Reuse base/SDK/framework layers
- Add only use case-specific code
- Maintain adapter pattern compatibility
- Production-ready error handling

### Dependencies

- Phase 3: Utilities, types
- Phase 4: StorageAdapter
- Phase 5: React hooks, components

## Architecture

### Use Case Structure (Per Template)

```
templates/simple-upload/
├── src/
│   ├── components/
│   │   ├── UploadForm.tsx
│   │   ├── FilePreview.tsx
│   │   └── DownloadButton.tsx
│   ├── App.tsx              # Overrides base App.tsx
│   └── styles.css           # Use case-specific styles
├── package.json             # Additional dependencies
└── README.md                # Use case docs

templates/gallery/
├── src/
│   ├── components/
│   │   ├── GalleryGrid.tsx
│   │   ├── UploadModal.tsx
│   │   └── FileCard.tsx
│   ├── types/
│   │   └── gallery.ts       # Gallery index types
│   ├── utils/
│   │   └── index-manager.ts # Index CRUD
│   ├── App.tsx
│   └── styles.css
├── package.json
└── README.md

templates/defi-nft/
├── src/
│   ├── components/
│   │   ├── MetadataForm.tsx
│   │   ├── MetadataPreview.tsx
│   │   └── MintButton.tsx
│   ├── types/
│   │   └── metadata.ts      # NFT metadata schema
│   ├── utils/
│   │   └── validator.ts     # Schema validation
│   ├── App.tsx
│   └── styles.css
├── package.json
└── README.md
```

## Related Code Files

### Simple Upload (3 hours)

1. `templates/simple-upload/src/components/UploadForm.tsx`
2. `templates/simple-upload/src/components/FilePreview.tsx`
3. `templates/simple-upload/src/components/DownloadButton.tsx`
4. `templates/simple-upload/src/App.tsx`
5. `templates/simple-upload/src/styles.css`
6. `templates/simple-upload/package.json`
7. `templates/simple-upload/README.md`

### File Gallery (3 hours)

8. `templates/gallery/src/components/GalleryGrid.tsx`
9. `templates/gallery/src/components/UploadModal.tsx`
10. `templates/gallery/src/components/FileCard.tsx`
11. `templates/gallery/src/types/gallery.ts`
12. `templates/gallery/src/utils/index-manager.ts`
13. `templates/gallery/src/App.tsx`
14. `templates/gallery/src/styles.css`
15. `templates/gallery/package.json`
16. `templates/gallery/README.md`

### DeFi/NFT Metadata (2 hours)

17. `templates/defi-nft/src/components/MetadataForm.tsx`
18. `templates/defi-nft/src/components/MetadataPreview.tsx`
19. `templates/defi-nft/src/components/MintButton.tsx`
20. `templates/defi-nft/src/types/metadata.ts`
21. `templates/defi-nft/src/utils/validator.ts`
22. `templates/defi-nft/src/App.tsx`
23. `templates/defi-nft/src/styles.css`
24. `templates/defi-nft/package.json`
25. `templates/defi-nft/README.md`

## Implementation Steps

## USE CASE 1: Simple Upload (3 hours)

### Step 1.1: Upload Form Component (45 min)

1. Create `simple-upload/src/components/UploadForm.tsx`:

```typescript
import { useState } from 'react';
import { useUpload } from '../../../react/src/hooks/useStorage.js';

export function UploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const upload = useUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    upload.mutate(
      { file: selectedFile, options: { epochs: 1 } },
      {
        onSuccess: (data) => {
          alert(`Upload successful! Blob ID: ${data.blobId}`);
        }
      }
    );
  };

  return (
    <div className="upload-form">
      <input
        type="file"
        onChange={handleFileChange}
        disabled={upload.isPending}
      />

      {selectedFile && (
        <div className="file-info">
          <p>Selected: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || upload.isPending}
      >
        {upload.isPending ? 'Uploading...' : 'Upload to Walrus'}
      </button>

      {upload.isError && (
        <p className="error">Error: {upload.error.message}</p>
      )}
    </div>
  );
}
```

### Step 1.2: File Preview Component (30 min)

2. Create `simple-upload/src/components/FilePreview.tsx`:

```typescript
import { useState } from 'react';
import { useDownload } from '../../../react/src/hooks/useStorage.js';

export function FilePreview() {
  const [blobId, setBlobId] = useState('');
  const { data, isLoading, error } = useDownload(blobId);

  const handleDownload = () => {
    if (!data) return;

    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `walrus-${blobId.slice(0, 8)}.bin`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="file-preview">
      <input
        type="text"
        placeholder="Enter Blob ID"
        value={blobId}
        onChange={(e) => setBlobId(e.target.value)}
      />

      {isLoading && <p>Loading...</p>}
      {error && <p className="error">Error: {error.message}</p>}

      {data && (
        <div className="preview-content">
          <p>✓ Blob found ({data.byteLength} bytes)</p>
          <button onClick={handleDownload}>Download File</button>
        </div>
      )}
    </div>
  );
}
```

### Step 1.3: App Integration (30 min)

3. Create `simple-upload/src/App.tsx`:

```typescript
import { Layout } from '../../react/src/components/Layout.js';
import { UploadForm } from './components/UploadForm.js';
import { FilePreview } from './components/FilePreview.js';
import './styles.css';

function App() {
  return (
    <Layout>
      <div className="simple-upload-app">
        <h2>📤 Simple Upload</h2>
        <p>Upload a file to Walrus and download it by Blob ID</p>

        <section className="upload-section">
          <h3>Upload File</h3>
          <UploadForm />
        </section>

        <section className="download-section">
          <h3>Download File</h3>
          <FilePreview />
        </section>
      </div>
    </Layout>
  );
}

export default App;
```

4. Create `simple-upload/src/styles.css`:

```css
.simple-upload-app {
  max-width: 800px;
  margin: 0 auto;
}

section {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #333;
  border-radius: 8px;
}

.upload-form,
.file-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-info {
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 4px;
}

.error {
  color: #ff4444;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Step 1.4: Documentation (30 min)

5. Create `simple-upload/package.json`:

```json
{
  "name": "walrus-simple-upload",
  "version": "0.1.0",
  "private": true,
  "dependencies": {}
}
```

6. Create `simple-upload/README.md`:

```markdown
# Simple Upload Use Case

Single file upload and download demo.

## Features

- Upload any file to Walrus
- Get Blob ID after upload
- Download file by Blob ID
- File size display

## Usage

1. Click "Choose File" and select a file
2. Click "Upload to Walrus"
3. Copy the Blob ID from the success message
4. Paste Blob ID in the download section
5. Click "Download File"

## Code Structure

- `UploadForm.tsx` - File upload UI
- `FilePreview.tsx` - Download UI
- `App.tsx` - Main app layout
```

## USE CASE 2: File Gallery (3 hours)

### Step 2.1: Gallery Types (30 min)

7. Create `gallery/src/types/gallery.ts`:

```typescript
export interface GalleryItem {
  blobId: string;
  name: string;
  size: number;
  contentType: string;
  uploadedAt: number;
}

export interface GalleryIndex {
  version: '1.0';
  items: GalleryItem[];
  lastModified: number;
}
```

### Step 2.2: Index Manager (45 min)

8. Create `gallery/src/utils/index-manager.ts`:

```typescript
import { storageAdapter } from '../../../sdk-mysten/src/index.js';
import type { GalleryIndex, GalleryItem } from '../types/gallery.js';

const INDEX_KEY = 'gallery-index';

export async function loadIndex(): Promise<GalleryIndex> {
  const stored = localStorage.getItem(INDEX_KEY);
  if (!stored) {
    return { version: '1.0', items: [], lastModified: Date.now() };
  }
  return JSON.parse(stored);
}

export async function saveIndex(index: GalleryIndex): Promise<void> {
  index.lastModified = Date.now();
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export async function addItem(item: GalleryItem): Promise<void> {
  const index = await loadIndex();
  index.items.push(item);
  await saveIndex(index);
}

export async function removeItem(blobId: string): Promise<void> {
  const index = await loadIndex();
  index.items = index.items.filter((item) => item.blobId !== blobId);
  await saveIndex(index);
}
```

### Step 2.3: Gallery Components (1.5 hours)

9. Create `gallery/src/components/GalleryGrid.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { FileCard } from './FileCard.js';
import { loadIndex } from '../utils/index-manager.js';
import type { GalleryItem } from '../types/gallery.js';

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    loadIndex().then((index) => setItems(index.items));
  }, []);

  const refreshGallery = async () => {
    const index = await loadIndex();
    setItems(index.items);
  };

  return (
    <div className="gallery-grid">
      {items.length === 0 ? (
        <p>No files yet. Upload your first file!</p>
      ) : (
        items.map((item) => (
          <FileCard key={item.blobId} item={item} onDelete={refreshGallery} />
        ))
      )}
    </div>
  );
}
```

10. Create `gallery/src/components/FileCard.tsx`:

```typescript
import { formatBytes, formatDate } from '../../../base/src/utils/format.js';
import { removeItem } from '../utils/index-manager.js';
import type { GalleryItem } from '../types/gallery.js';

interface FileCardProps {
  item: GalleryItem;
  onDelete: () => void;
}

export function FileCard({ item, onDelete }: FileCardProps) {
  const handleDelete = async () => {
    if (confirm(`Delete ${item.name}?`)) {
      await removeItem(item.blobId);
      onDelete();
    }
  };

  return (
    <div className="file-card">
      <h4>{item.name}</h4>
      <p>Size: {formatBytes(item.size)}</p>
      <p>Uploaded: {formatDate(item.uploadedAt)}</p>
      <p className="blob-id">Blob ID: {item.blobId.slice(0, 12)}...</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

11. Create `gallery/src/components/UploadModal.tsx`:

```typescript
import { useState } from 'react';
import { useUpload } from '../../../react/src/hooks/useStorage.js';
import { addItem } from '../utils/index-manager.js';

interface UploadModalProps {
  onSuccess: () => void;
}

export function UploadModal({ onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const upload = useUpload();

  const handleUpload = async () => {
    if (!file) return;

    upload.mutate(
      { file, options: { epochs: 1 } },
      {
        onSuccess: async (data) => {
          await addItem({
            blobId: data.blobId,
            name: file.name,
            size: file.size,
            contentType: file.type,
            uploadedAt: Date.now()
          });
          setFile(null);
          onSuccess();
        }
      }
    );
  };

  return (
    <div className="upload-modal">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={!file || upload.isPending}>
        {upload.isPending ? 'Uploading...' : 'Add to Gallery'}
      </button>
    </div>
  );
}
```

12. Create `gallery/src/App.tsx`:

```typescript
import { useState } from 'react';
import { Layout } from '../../react/src/components/Layout.js';
import { GalleryGrid } from './components/GalleryGrid.js';
import { UploadModal } from './components/UploadModal.js';
import './styles.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Layout>
      <div className="gallery-app">
        <h2>🖼️ File Gallery</h2>
        <UploadModal onSuccess={() => setRefreshKey((k) => k + 1)} />
        <GalleryGrid key={refreshKey} />
      </div>
    </Layout>
  );
}

export default App;
```

### Step 2.4: Documentation (30 min)

13. Create `gallery/README.md`:

````markdown
# File Gallery Use Case

Manage multiple files with a persistent index.

## Features

- Upload multiple files
- Grid view of all files
- Local index (localStorage)
- Delete files from gallery
- File metadata display

## Index Format

```json
{
  "version": "1.0",
  "items": [
    {
      "blobId": "abc123...",
      "name": "photo.jpg",
      "size": 102400,
      "contentType": "image/jpeg",
      "uploadedAt": 1705449600000
    }
  ],
  "lastModified": 1705449600000
}
```
````

````

## USE CASE 3: DeFi/NFT Metadata (2 hours)

### Step 3.1: Metadata Types & Validation (45 min)

14. Create `defi-nft/src/types/metadata.ts`:
```typescript
export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // Blob ID of image
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}
````

15. Create `defi-nft/src/utils/validator.ts`:

```typescript
import type { NFTMetadata } from '../types/metadata.js';

export function validateMetadata(metadata: Partial<NFTMetadata>): string[] {
  const errors: string[] = [];

  if (!metadata.name || metadata.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!metadata.description || metadata.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!metadata.image || !/^[a-f0-9]{64}$/.test(metadata.image)) {
    errors.push('Valid image Blob ID is required');
  }

  return errors;
}
```

### Step 3.2: Metadata Components (1 hour)

16. Create `defi-nft/src/components/MetadataForm.tsx`:

```typescript
import { useState } from 'react';
import { validateMetadata } from '../utils/validator.js';
import type { NFTMetadata } from '../types/metadata.js';

interface MetadataFormProps {
  onSubmit: (metadata: NFTMetadata) => void;
}

export function MetadataForm({ onSubmit }: MetadataFormProps) {
  const [metadata, setMetadata] = useState<Partial<NFTMetadata>>({
    attributes: []
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const validationErrors = validateMetadata(metadata);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(metadata as NFTMetadata);
  };

  return (
    <form className="metadata-form">
      <input
        placeholder="NFT Name"
        value={metadata.name || ''}
        onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={metadata.description || ''}
        onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
      />
      <input
        placeholder="Image Blob ID"
        value={metadata.image || ''}
        onChange={(e) => setMetadata({ ...metadata, image: e.target.value })}
      />

      {errors.length > 0 && (
        <div className="errors">
          {errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}

      <button type="button" onClick={handleSubmit}>
        Upload Metadata
      </button>
    </form>
  );
}
```

17. Create `defi-nft/src/App.tsx`:

```typescript
import { Layout } from '../../react/src/components/Layout.js';
import { MetadataForm } from './components/MetadataForm.js';
import { useUpload } from '../../react/src/hooks/useStorage.js';
import type { NFTMetadata } from './types/metadata.js';
import './styles.css';

function App() {
  const upload = useUpload();

  const handleMetadataSubmit = async (metadata: NFTMetadata) => {
    const json = JSON.stringify(metadata, null, 2);
    const blob = new TextEncoder().encode(json);

    upload.mutate(
      { file: blob, options: { epochs: 5 } },
      {
        onSuccess: (data) => {
          alert(`Metadata uploaded! Blob ID: ${data.blobId}`);
        }
      }
    );
  };

  return (
    <Layout>
      <div className="defi-nft-app">
        <h2>💎 NFT Metadata Creator</h2>
        <MetadataForm onSubmit={handleMetadataSubmit} />
        {upload.isPending && <p>Uploading metadata...</p>}
      </div>
    </Layout>
  );
}

export default App;
```

### Step 3.3: Documentation (15 min)

18. Create `defi-nft/README.md`:

````markdown
# DeFi/NFT Metadata Use Case

Create and upload NFT metadata JSON to Walrus.

## Features

- NFT metadata form
- JSON schema validation
- Upload to Walrus
- OpenSea-compatible format

## Metadata Schema

Follows OpenSea metadata standard:

```json
{
  "name": "My NFT",
  "description": "Cool NFT",
  "image": "<blob-id>",
  "attributes": [{ "trait_type": "Rarity", "value": "Legendary" }]
}
```
````

```

## Todo List

### Simple Upload
- [ ] Create `simple-upload/src/components/UploadForm.tsx`
- [ ] Create `simple-upload/src/components/FilePreview.tsx`
- [ ] Create `simple-upload/src/App.tsx`
- [ ] Create `simple-upload/src/styles.css`
- [ ] Create `simple-upload/package.json`
- [ ] Create `simple-upload/README.md`
- [ ] Test upload flow
- [ ] Test download flow

### Gallery
- [ ] Create `gallery/src/types/gallery.ts`
- [ ] Create `gallery/src/utils/index-manager.ts`
- [ ] Create `gallery/src/components/GalleryGrid.tsx`
- [ ] Create `gallery/src/components/FileCard.tsx`
- [ ] Create `gallery/src/components/UploadModal.tsx`
- [ ] Create `gallery/src/App.tsx`
- [ ] Create `gallery/src/styles.css`
- [ ] Create `gallery/README.md`
- [ ] Test multi-file upload
- [ ] Test index persistence

### DeFi/NFT
- [ ] Create `defi-nft/src/types/metadata.ts`
- [ ] Create `defi-nft/src/utils/validator.ts`
- [ ] Create `defi-nft/src/components/MetadataForm.tsx`
- [ ] Create `defi-nft/src/App.tsx`
- [ ] Create `defi-nft/src/styles.css`
- [ ] Create `defi-nft/README.md`
- [ ] Test metadata validation
- [ ] Test JSON upload

## Success Criteria

- [ ] All 3 use cases have complete file structures
- [ ] Each use case has working App.tsx
- [ ] Simple Upload: Upload + download works
- [ ] Gallery: Multi-file management works
- [ ] DeFi/NFT: Metadata validation + upload works
- [ ] All use cases documented in README
- [ ] Code quality: TypeScript strict, ESLint passes

## Risk Assessment

### Potential Blockers
1. **localStorage limits**: Gallery index too large
   - **Mitigation**: Upload index to Walrus (future feature)
2. **File type restrictions**: Binary files not supported
   - **Mitigation**: All file types work as Uint8Array
3. **Metadata schema changes**: OpenSea updates standard
   - **Mitigation**: Validator is extensible

## Security Considerations

1. **File upload size**: DoS via huge files
   - **Hardening**: Add size limits (10MB browser, configurable)
2. **XSS via file names**: Malicious file names in gallery
   - **Hardening**: Sanitize display names
3. **Metadata injection**: Script tags in JSON
   - **Hardening**: Validate JSON schema strictly

## Next Steps

After Phase 6:
1. **Phase 7**: Template generation engine (composes all layers)
2. **Phase 8**: Post-install validation
3. **Testing**: E2E tests for each use case

### Open Questions
- Add image preview for gallery? (Decision: Yes, use Blob URLs)
- Support drag-and-drop upload? (Decision: Future enhancement)
```
````

## File: phase-07-generation-engine.md

````markdown
# Phase 7: Template Generation Engine

## Context Links

- [Main Plan](./plan.md)
- [PRD](../../POC/PRD.md)
- [CLI Scaffolding Research](../reports/researcher-260117-1353-cli-scaffolding.md)
- [Phase 2: CLI Engine Core](./phase-02-cli-engine-core.md)
- [Phase 3-6: Template Layers](./phase-03-template-base-layer.md)

## Overview

**Created:** 2026-01-17  
**Priority:** High  
**Status:** pending  
**Estimated Effort:** 6 hours  
**Dependencies:** Phase 2-6 complete

## Key Insights

### From Research

1. **Base + Layer Pattern**: Avoid N×M template explosion
2. **Deep Merge**: Intelligent JSON merging for package.json
3. **File Overlaying**: Later layers override earlier ones
4. **Transform Strategy**: EJS for dynamic placeholders
5. **Atomic Operations**: All-or-nothing file generation

### Critical Pattern

```
Base (skeleton)
  + SDK Layer (adapter impl)
  + Framework Layer (React/Vue)
  + Use Case Layer (app logic)
  = Generated Project
```

## Requirements

### Functional

- Copy files from multiple template layers
- Deep merge package.json from all layers
- Transform files with project name placeholders
- Handle file conflicts (later layers win)
- Atomic generation (rollback on error)

### Technical

- Recursive directory copying
- JSON deep merge algorithm
- Template variable substitution
- Path normalization (cross-platform)
- Error recovery

### Dependencies

- Phase 2: Context object
- Phase 3-6: Template layers

## Architecture

### Generation Flow

```
Context (from Phase 2)
    ↓
Select Layers (base + sdk + framework + useCase)
    ↓
Pre-Flight Checks (dir exists? writable?)
    ↓
Copy Base Layer
    ↓
Overlay SDK Layer
    ↓
Overlay Framework Layer
    ↓
Overlay Use Case Layer
    ↓
Merge package.json (deep)
    ↓
Sort & Format JSON
    ↓
Transform Variables
    ↓
Write Files (atomic)
```

### Generator Module Structure

```
packages/cli/src/
├── generator/
│   ├── index.ts               # Main generator
│   ├── file-ops.ts            # File operations
│   ├── merge.ts               # Deep merge logic
│   ├── transform.ts           # Variable substitution
│   └── layers.ts              # Layer resolution
```

### Deep Merge Algorithm

```typescript
function deepMerge(base: any, overlay: any): any {
  if (Array.isArray(overlay)) {
    return overlay; // Arrays replace, don't merge
  }

  if (typeof overlay === 'object' && overlay !== null) {
    const result = { ...base };
    for (const key in overlay) {
      result[key] =
        key in base && typeof base[key] === 'object'
          ? deepMerge(base[key], overlay[key])
          : overlay[key];
    }
    return result;
  }

  return overlay; // Primitives replace
}
```

### File Overlay Logic

```typescript
// Later layers override earlier layers
const layers = [
  'templates/base',
  `templates/sdk-${context.sdk}`,
  `templates/${context.framework}`,
  `templates/${context.useCase}`,
];

for (const layer of layers) {
  await copyLayer(layer, targetDir);
}
```

## Related Code Files

### To Create

1. `packages/cli/src/generator/index.ts` - Main generator
2. `packages/cli/src/generator/file-ops.ts` - File operations
3. `packages/cli/src/generator/merge.ts` - Deep merge
4. `packages/cli/src/generator/transform.ts` - Variable substitution
5. `packages/cli/src/generator/layers.ts` - Layer resolution
6. `packages/cli/src/generator/types.ts` - Generator types

### To Modify

- `packages/cli/src/index.ts` - Call generator after validation

## Implementation Steps

### Step 1: Generator Types (30 min)

1. Create `packages/cli/src/generator/types.ts`:

```typescript
import type { Context } from '../types.js';

export interface Layer {
  name: string;
  path: string;
  priority: number; // Higher priority overwrites
}

export interface GeneratorOptions {
  context: Context;
  templateDir: string;
  targetDir: string;
  dryRun?: boolean;
}

export interface GeneratorResult {
  success: boolean;
  projectPath: string;
  filesCreated: number;
  error?: Error;
}
```

### Step 2: Layer Resolution (45 min)

2. Create `packages/cli/src/generator/layers.ts`:

```typescript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Context } from '../types.js';
import type { Layer } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates are in packages/cli/templates (published with package)
const TEMPLATE_ROOT = path.join(__dirname, '../../templates');

export function resolveLayers(context: Context): Layer[] {
  const layers: Layer[] = [
    {
      name: 'base',
      path: path.join(TEMPLATE_ROOT, 'base'),
      priority: 1,
    },
    {
      name: `sdk-${context.sdk}`,
      path: path.join(TEMPLATE_ROOT, `sdk-${context.sdk}`),
      priority: 2,
    },
    {
      name: context.framework,
      path: path.join(TEMPLATE_ROOT, context.framework),
      priority: 3,
    },
    {
      name: context.useCase,
      path: path.join(TEMPLATE_ROOT, context.useCase),
      priority: 4,
    },
  ];

  // Optional: Tailwind layer
  if (context.tailwind) {
    layers.push({
      name: 'tailwind',
      path: path.join(TEMPLATE_ROOT, 'tailwind'),
      priority: 5,
    });
  }

  // Optional: Analytics layer
  if (context.analytics) {
    layers.push({
      name: 'analytics',
      path: path.join(TEMPLATE_ROOT, 'analytics'),
      priority: 6,
    });
  }

  return layers;
}
```

### Step 3: File Operations (1.5 hours)

3. Create `packages/cli/src/generator/file-ops.ts`:

```typescript
import fs from 'fs-extra';
import path from 'node:path';

/**
 * Recursively copy directory, excluding certain files
 */
export async function copyDirectory(
  src: string,
  dest: string,
  exclude: string[] = ['node_modules', '.git', 'dist']
): Promise<number> {
  let filesCreated = 0;

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.ensureDir(destPath);
      filesCreated += await copyDirectory(srcPath, destPath, exclude);
    } else {
      await fs.copy(srcPath, destPath, { overwrite: true });
      filesCreated++;
    }
  }

  return filesCreated;
}

/**
 * Check if directory is empty
 */
export async function isDirectoryEmpty(dir: string): Promise<boolean> {
  const exists = await fs.pathExists(dir);
  if (!exists) return true;

  const entries = await fs.readdir(dir);
  return entries.length === 0;
}

/**
 * Create directory if it doesn't exist
 */
export async function ensureDirectory(dir: string): Promise<void> {
  await fs.ensureDir(dir);
}
```

### Step 4: Deep Merge Logic (1 hour)

4. Create `packages/cli/src/generator/merge.ts`:

```typescript
import fs from 'fs-extra';
import path from 'node:path';
import sortPackageJson from 'sort-package-json';

/**
 * Deep merge two objects
 */
export function deepMerge<T = any>(target: T, source: T): T {
  // Handle null/undefined
  if (source === null || source === undefined) {
    return target;
  }

  // Arrays: Replace entirely (don't merge)
  if (Array.isArray(source)) {
    return source as T;
  }

  // Objects: Merge recursively
  if (typeof source === 'object' && typeof target === 'object') {
    const result = { ...target } as any;

    for (const key in source) {
      const sourceValue = (source as any)[key];
      const targetValue = result[key];

      if (
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue) &&
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }

    return result as T;
  }

  // Primitives: Replace
  return source;
}

/**
 * Merge multiple package.json files from layers
 */
export async function mergePackageJsonFiles(
  layers: string[],
  outputPath: string
): Promise<void> {
  let merged: any = {};

  for (const layerPath of layers) {
    const pkgPath = path.join(layerPath, 'package.json');

    if (await fs.pathExists(pkgPath)) {
      const pkgJson = await fs.readJson(pkgPath);
      merged = deepMerge(merged, pkgJson);
    }
  }

  // Sort keys for consistency
  const sorted = sortPackageJson(merged);

  await fs.writeJson(outputPath, sorted, { spaces: 2 });
}
```

### Step 5: Variable Transformation (45 min)

5. Create `packages/cli/src/generator/transform.ts`:

```typescript
import fs from 'fs-extra';
import path from 'node:path';
import type { Context } from '../types.js';

interface TransformVariables {
  projectName: string;
  sdkName: string;
  framework: string;
  useCase: string;
}

/**
 * Build transformation variables from context
 */
export function buildVariables(context: Context): TransformVariables {
  return {
    projectName: context.projectName,
    sdkName: context.sdk,
    framework: context.framework,
    useCase: context.useCase,
  };
}

/**
 * Transform string with variable substitution
 */
export function transformString(
  content: string,
  vars: TransformVariables
): string {
  return content
    .replace(/\{\{projectName\}\}/g, vars.projectName)
    .replace(/\{\{sdkName\}\}/g, vars.sdkName)
    .replace(/\{\{framework\}\}/g, vars.framework)
    .replace(/\{\{useCase\}\}/g, vars.useCase);
}

/**
 * Transform all text files in directory
 */
export async function transformDirectory(
  dir: string,
  vars: TransformVariables,
  extensions: string[] = ['.md', '.json', '.html']
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await transformDirectory(fullPath, vars, extensions);
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      const content = await fs.readFile(fullPath, 'utf-8');
      const transformed = transformString(content, vars);
      await fs.writeFile(fullPath, transformed, 'utf-8');
    }
  }
}
```

### Step 6: Main Generator (1.5 hours)

6. Create `packages/cli/src/generator/index.ts`:

```typescript
import path from 'node:path';
import fs from 'fs-extra';
import { logger } from '../utils/logger.js';
import { resolveLayers } from './layers.js';
import {
  copyDirectory,
  ensureDirectory,
  isDirectoryEmpty,
} from './file-ops.js';
import { mergePackageJsonFiles } from './merge.js';
import { buildVariables, transformDirectory } from './transform.js';
import type { GeneratorOptions, GeneratorResult } from './types.js';

export async function generateProject(
  options: GeneratorOptions
): Promise<GeneratorResult> {
  const { context, targetDir, dryRun = false } = options;

  try {
    logger.info(`🏗️  Generating project: ${context.projectName}`);

    // Pre-flight checks
    if (!dryRun) {
      const isEmpty = await isDirectoryEmpty(targetDir);
      if (!isEmpty) {
        throw new Error(
          `Directory ${targetDir} is not empty. Please use an empty directory.`
        );
      }
      await ensureDirectory(targetDir);
    }

    // Resolve layers
    const layers = resolveLayers(context);
    logger.info(`📦 Layers: ${layers.map((l) => l.name).join(' + ')}`);

    let filesCreated = 0;

    // Copy layers sequentially (later layers override)
    for (const layer of layers) {
      if (!(await fs.pathExists(layer.path))) {
        logger.warn(`⚠️  Layer not found: ${layer.path} (skipping)`);
        continue;
      }

      logger.info(`📁 Copying layer: ${layer.name}`);

      if (!dryRun) {
        const count = await copyDirectory(layer.path, targetDir);
        filesCreated += count;
      }
    }

    // Merge package.json from all layers
    logger.info('🔗 Merging package.json files');
    if (!dryRun) {
      await mergePackageJsonFiles(
        layers.map((l) => l.path),
        path.join(targetDir, 'package.json')
      );
    }

    // Transform template variables
    logger.info('✏️  Transforming template variables');
    if (!dryRun) {
      const vars = buildVariables(context);
      await transformDirectory(targetDir, vars);
    }

    logger.success(`✓ Project generated successfully!`);
    logger.info(`📂 Files created: ${filesCreated}`);

    return {
      success: true,
      projectPath: targetDir,
      filesCreated,
    };
  } catch (error) {
    logger.error(`Failed to generate project: ${error}`);

    // Rollback: Remove partially created directory
    if (!dryRun && (await fs.pathExists(targetDir))) {
      logger.warn('🧹 Rolling back partial changes...');
      await fs.remove(targetDir);
    }

    return {
      success: false,
      projectPath: targetDir,
      filesCreated: 0,
      error: error as Error,
    };
  }
}
```

### Step 7: Integrate with CLI (45 min)

7. Update `packages/cli/src/index.ts`:

```typescript
// ... existing imports ...
import { generateProject } from './generator/index.js';

// ... existing program setup ...

.action(async (projectNameArg, options) => {
  try {
    logger.info('🚀 Welcome to Walrus Starter Kit!');

    // ... existing validation code ...

    // Generate project
    logger.info('\n🏗️  Generating your Walrus application...\n');

    const result = await generateProject({
      context,
      templateDir: path.join(__dirname, '../templates'),
      targetDir: context.projectPath
    });

    if (!result.success) {
      logger.error('❌ Project generation failed');
      process.exit(1);
    }

    // Success message
    logger.success('\n✨ Project created successfully!\n');
    logger.info('Next steps:');
    logger.info(`  cd ${context.projectName}`);
    logger.info(`  ${context.packageManager} install`);
    logger.info(`  ${context.packageManager} run dev`);

  } catch (error) {
    logger.error(`Failed to create project: ${error}`);
    process.exit(1);
  }
});
```

### Step 8: Testing (1 hour)

8. Create test script `packages/cli/src/test-generator.ts`:

```typescript
import { generateProject } from './generator/index.js';
import type { Context } from './types.js';
import path from 'node:path';

const testContext: Context = {
  projectName: 'test-walrus-app',
  projectPath: path.resolve('/tmp/test-walrus-app'),
  sdk: 'mysten',
  framework: 'react',
  useCase: 'simple-upload',
  analytics: false,
  tailwind: true,
  packageManager: 'pnpm',
};

async function test() {
  console.log('Testing generator...');

  const result = await generateProject({
    context: testContext,
    templateDir: path.join(__dirname, '../templates'),
    targetDir: testContext.projectPath,
    dryRun: false,
  });

  console.log('Result:', result);
}

test().catch(console.error);
```

## Todo List

- [ ] Create `generator/types.ts` with interfaces
- [ ] Create `generator/layers.ts` with resolution logic
- [ ] Create `generator/file-ops.ts` with copy functions
- [ ] Create `generator/merge.ts` with deep merge
- [ ] Create `generator/transform.ts` with variable substitution
- [ ] Create `generator/index.ts` with main generator
- [ ] Update `src/index.ts` to call generator
- [ ] Add `sort-package-json` dependency
- [ ] Create test script
- [ ] Test generation with all combinations
- [ ] Test dry-run mode
- [ ] Test error rollback

## Success Criteria

### Functional Tests

- [ ] Base + SDK + Framework + UseCase layers combine correctly
- [ ] package.json merges all dependencies
- [ ] Variables transform in README/package.json
- [ ] Later layers override earlier files
- [ ] Empty directory check works
- [ ] Rollback works on error

### Integration Tests

```bash
# Test full generation
cd packages/cli
npm run build
node dist/index.js test-app --sdk mysten --framework react --use-case simple-upload

# Verify output
cd test-app
cat package.json  # Should have merged deps
cat README.md     # Should have project name
npm install       # Should succeed
npm run dev       # Should start
```

### Edge Cases

- [ ] Non-empty directory error
- [ ] Missing layer graceful skip
- [ ] Invalid JSON merge recovery
- [ ] Cross-platform path handling

## Risk Assessment

### Potential Blockers

1. **File permission errors**: Can't write to target directory
   - **Mitigation**: Check write permissions before starting
2. **Layer conflicts**: Two layers have incompatible files
   - **Mitigation**: Clear layer priority, test all combinations
3. **package.json corruption**: Invalid merge result
   - **Mitigation**: Validate JSON after merge, rollback on error

### Contingency Plans

- If deep merge fails: Fall back to simple overlay (later wins)
- If rollback fails: Log error, provide manual cleanup instructions

## Security Considerations

### Phase-Specific Concerns

1. **Path traversal**: Malicious layer paths
   - **Hardening**: Validate layer paths are within template root
2. **Symbolic link attacks**: Malicious symlinks in templates
   - **Hardening**: Use `fs.copy` with `dereference: true`
3. **Code injection**: Malicious template code
   - **Hardening**: Templates are bundled with CLI (trusted)

### Hardening Measures

```typescript
function validateLayerPath(layerPath: string, root: string): void {
  const normalized = path.normalize(layerPath);
  if (!normalized.startsWith(root)) {
    throw new Error('Invalid layer path: outside template root');
  }
}
```

## Next Steps

After Phase 7 completion:

1. **Phase 8**: Post-install automation (npm install, git init)
2. **Testing**: E2E tests for all template combinations
3. **Publishing**: Prepare npm package

### Dependencies for Next Phase

Phase 8 requires:

- Generated project directory ✅
- Context object with packageManager ✅

### Open Questions

- Should we validate generated package.json? (Decision: Yes, in Phase 8)
- Support custom template URLs? (Decision: Future feature)
- Add template caching? (Decision: Not needed for MVP)
````

## File: phase-08-post-install.md

````markdown
# Phase 8: Post-Install & Validation

## Context Links

- [Main Plan](./plan.md)
- [PRD](../../POC/PRD.md)
- [CLI Scaffolding Research](../reports/researcher-260117-1353-cli-scaffolding.md)
- [Phase 7: Generation Engine](./phase-07-generation-engine.md)

## Overview

**Created:** 2026-01-17  
**Priority:** Medium  
**Status:** pending  
**Estimated Effort:** 7 hours  
**Dependencies:** Phase 7 complete

## Key Insights

### From Research

1. **Package Manager Detection**: Use `npm_config_user_agent` for accurate detection
2. **Automatic Install**: Run `npm install` automatically to minimize "Time to Hello World"
3. **Git Initialization**: Create `.git` and initial commit for version control
4. **Success Messaging**: Clear, actionable next steps with colored output
5. **Validation**: Verify generated project can build before declaring success

### Critical UX Pattern

```
npm create walrus-app@latest my-app
  → Prompts (30s)
  → Generation (5s)
  → npm install (45s)    ← Automated
  → git init (2s)        ← Automated
  → Success message
  → cd my-app && npm run dev ← User action
```

## Requirements

### Functional

- Detect package manager (npm/pnpm/yarn/bun)
- Install dependencies automatically
- Initialize git repository
- Create initial commit
- Validate generated project
- Display next steps

### Technical

- Cross-platform command execution
- Stream install output to user
- Handle install failures gracefully
- Verify package.json validity
- Check TypeScript compilation

### Dependencies

- Phase 7: Generated project directory

## Architecture

### Post-Install Flow

```
Project Generated
    ↓
Detect Package Manager
    ↓
Run Install Command (streaming output)
    ↓
Validate Installation (check node_modules)
    ↓
Initialize Git
    ↓
Create Initial Commit
    ↓
Validate Build (tsc --noEmit)
    ↓
Display Success Message
```

### Module Structure

```
packages/cli/src/
├── post-install/
│   ├── index.ts              # Main orchestrator
│   ├── package-manager.ts    # PM detection & install
│   ├── git.ts                # Git initialization
│   ├── validator.ts          # Project validation
│   └── messages.ts           # Success messages
```

### Package Manager Commands

```typescript
const PM_COMMANDS = {
  npm: { install: 'npm install', run: 'npm run' },
  pnpm: { install: 'pnpm install', run: 'pnpm' },
  yarn: { install: 'yarn', run: 'yarn' },
  bun: { install: 'bun install', run: 'bun run' },
};
```

## Related Code Files

### To Create

1. `packages/cli/src/post-install/index.ts` - Main orchestrator
2. `packages/cli/src/post-install/package-manager.ts` - Install logic
3. `packages/cli/src/post-install/git.ts` - Git initialization
4. `packages/cli/src/post-install/validator.ts` - Project validation
5. `packages/cli/src/post-install/messages.ts` - Success messages

### To Modify

- `packages/cli/src/index.ts` - Call post-install after generation
- `packages/cli/package.json` - Add `cross-spawn` dependency

## Implementation Steps

### Step 1: Package Manager Detection & Install (2 hours)

1. Add dependency to `packages/cli/package.json`:

```json
{
  "dependencies": {
    "cross-spawn": "^7.0.3"
  },
  "devDependencies": {
    "@types/cross-spawn": "^6.0.6"
  }
}
```

2. Create `post-install/package-manager.ts`:

```typescript
import spawn from 'cross-spawn';
import { logger } from '../utils/logger.js';
import type { PackageManager } from '../types.js';

interface InstallResult {
  success: boolean;
  duration: number;
  error?: Error;
}

/**
 * Get install command for package manager
 */
function getInstallCommand(pm: PackageManager): string {
  const commands: Record<PackageManager, string> = {
    npm: 'npm install',
    pnpm: 'pnpm install',
    yarn: 'yarn',
    bun: 'bun install',
  };
  return commands[pm];
}

/**
 * Install dependencies using detected package manager
 */
export async function installDependencies(
  projectPath: string,
  packageManager: PackageManager
): Promise<InstallResult> {
  const startTime = Date.now();

  logger.info(`📦 Installing dependencies with ${packageManager}...`);

  return new Promise((resolve) => {
    const [cmd, ...args] = getInstallCommand(packageManager).split(' ');

    const child = spawn(cmd, args, {
      cwd: projectPath,
      stdio: 'inherit', // Stream output to user
      shell: true,
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;

      if (code === 0) {
        logger.success(
          `✓ Dependencies installed (${(duration / 1000).toFixed(1)}s)`
        );
        resolve({ success: true, duration });
      } else {
        const error = new Error(`Install failed with exit code ${code}`);
        logger.error(`❌ Dependency installation failed`);
        resolve({ success: false, duration, error });
      }
    });

    child.on('error', (error) => {
      const duration = Date.now() - startTime;
      logger.error(`❌ Failed to run ${packageManager}: ${error.message}`);
      resolve({ success: false, duration, error });
    });
  });
}

/**
 * Get run command for package manager
 */
export function getRunCommand(pm: PackageManager, script: string): string {
  const runCommands: Record<PackageManager, string> = {
    npm: `npm run ${script}`,
    pnpm: `pnpm ${script}`,
    yarn: `yarn ${script}`,
    bun: `bun run ${script}`,
  };
  return runCommands[pm];
}
```

### Step 2: Git Initialization (1 hour)

3. Create `post-install/git.ts`:

```typescript
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'node:path';
import { logger } from '../utils/logger.js';

interface GitResult {
  success: boolean;
  error?: Error;
}

/**
 * Check if git is available
 */
async function isGitAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn('git', ['--version'], { stdio: 'ignore' });
    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

/**
 * Initialize git repository
 */
export async function initializeGit(projectPath: string): Promise<GitResult> {
  // Check if git is available
  if (!(await isGitAvailable())) {
    logger.warn('⚠️  Git not found, skipping initialization');
    return { success: false };
  }

  // Check if already a git repo
  if (await fs.pathExists(path.join(projectPath, '.git'))) {
    logger.info('📝 Git repository already exists');
    return { success: true };
  }

  logger.info('📝 Initializing git repository...');

  // Run git init
  return new Promise((resolve) => {
    const child = spawn('git', ['init'], {
      cwd: projectPath,
      stdio: 'ignore',
    });

    child.on('close', (code) => {
      if (code === 0) {
        logger.success('✓ Git repository initialized');
        resolve({ success: true });
      } else {
        resolve({
          success: false,
          error: new Error(`git init failed with code ${code}`),
        });
      }
    });

    child.on('error', (error) => {
      resolve({ success: false, error });
    });
  });
}

/**
 * Create initial commit
 */
export async function createInitialCommit(
  projectPath: string
): Promise<GitResult> {
  if (!(await fs.pathExists(path.join(projectPath, '.git')))) {
    return { success: false, error: new Error('Not a git repository') };
  }

  logger.info('📝 Creating initial commit...');

  // Stage all files
  return new Promise((resolve) => {
    const addChild = spawn('git', ['add', '.'], {
      cwd: projectPath,
      stdio: 'ignore',
    });

    addChild.on('close', (code) => {
      if (code !== 0) {
        resolve({ success: false, error: new Error('git add failed') });
        return;
      }

      // Create commit
      const commitChild = spawn(
        'git',
        ['commit', '-m', 'chore: initial commit from create-walrus-app'],
        {
          cwd: projectPath,
          stdio: 'ignore',
        }
      );

      commitChild.on('close', (commitCode) => {
        if (commitCode === 0) {
          logger.success('✓ Initial commit created');
          resolve({ success: true });
        } else {
          resolve({ success: false, error: new Error('git commit failed') });
        }
      });

      commitChild.on('error', (error) => {
        resolve({ success: false, error });
      });
    });

    addChild.on('error', (error) => {
      resolve({ success: false, error });
    });
  });
}
```

### Step 3: Project Validation (1.5 hours)

4. Create `post-install/validator.ts`:

```typescript
import fs from 'fs-extra';
import path from 'node:path';
import spawn from 'cross-spawn';
import { logger } from '../utils/logger.js';

interface ValidationResult {
  valid: boolean;
  checks: {
    packageJson: boolean;
    nodeModules: boolean;
    dependencies: boolean;
    typescript: boolean;
  };
  errors: string[];
}

/**
 * Validate generated project
 */
export async function validateProject(
  projectPath: string
): Promise<ValidationResult> {
  logger.info('🔍 Validating project...');

  const result: ValidationResult = {
    valid: true,
    checks: {
      packageJson: false,
      nodeModules: false,
      dependencies: false,
      typescript: false,
    },
    errors: [],
  };

  // Check 1: package.json exists and is valid
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);

    if (!pkg.name || !pkg.version) {
      result.errors.push('package.json missing required fields');
    } else {
      result.checks.packageJson = true;
    }
  } catch (error) {
    result.errors.push('Invalid or missing package.json');
  }

  // Check 2: node_modules exists
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  if (await fs.pathExists(nodeModulesPath)) {
    result.checks.nodeModules = true;
  } else {
    result.errors.push('node_modules not found');
  }

  // Check 3: Dependencies installed
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    let allInstalled = true;
    for (const dep in deps) {
      const depPath = path.join(nodeModulesPath, dep);
      if (!(await fs.pathExists(depPath))) {
        allInstalled = false;
        result.errors.push(`Dependency not installed: ${dep}`);
        break;
      }
    }

    result.checks.dependencies = allInstalled;
  } catch (error) {
    result.errors.push('Failed to verify dependencies');
  }

  // Check 4: TypeScript compilation (if tsconfig exists)
  const tsconfigPath = path.join(projectPath, 'tsconfig.json');
  if (await fs.pathExists(tsconfigPath)) {
    const tscResult = await checkTypeScript(projectPath);
    result.checks.typescript = tscResult.success;

    if (!tscResult.success) {
      result.errors.push(`TypeScript errors: ${tscResult.error}`);
    }
  } else {
    result.checks.typescript = true; // Not applicable
  }

  result.valid = Object.values(result.checks).every(Boolean);

  if (result.valid) {
    logger.success('✓ Project validation passed');
  } else {
    logger.warn('⚠️  Project validation failed:');
    result.errors.forEach((err) => logger.warn(`  - ${err}`));
  }

  return result;
}

/**
 * Check TypeScript compilation
 */
async function checkTypeScript(
  projectPath: string
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsc', '--noEmit'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    let stderr = '';
    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: stderr.split('\n')[0] });
      }
    });

    child.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
  });
}
```

### Step 4: Success Messages (1 hour)

5. Create `post-install/messages.ts`:

```typescript
import kleur from 'kleur';
import { logger } from '../utils/logger.js';
import { getRunCommand } from './package-manager.js';
import type { Context } from '../types.js';

/**
 * Display success message with next steps
 */
export function displaySuccess(context: Context): void {
  const { projectName, packageManager, sdk, framework, useCase } = context;

  console.log('\n' + kleur.green('━'.repeat(60)));
  console.log(kleur.bold().green('  ✨ Project created successfully! ✨'));
  console.log(kleur.green('━'.repeat(60)));

  console.log('\n' + kleur.bold('📦 Project Details:'));
  console.log(`  Name: ${kleur.cyan(projectName)}`);
  console.log(`  SDK: ${kleur.cyan(sdk)}`);
  console.log(`  Framework: ${kleur.cyan(framework)}`);
  console.log(`  Use Case: ${kleur.cyan(useCase)}`);

  console.log('\n' + kleur.bold('🚀 Next Steps:'));
  console.log(`  ${kleur.gray('1.')} cd ${kleur.cyan(projectName)}`);
  console.log(
    `  ${kleur.gray('2.')} ${kleur.cyan(getRunCommand(packageManager, 'dev'))}`
  );

  console.log('\n' + kleur.bold('📚 Helpful Commands:'));
  console.log(
    `  ${kleur.cyan(getRunCommand(packageManager, 'dev'))}      - Start development server`
  );
  console.log(
    `  ${kleur.cyan(getRunCommand(packageManager, 'build'))}    - Build for production`
  );
  console.log(
    `  ${kleur.cyan(getRunCommand(packageManager, 'lint'))}     - Run linter`
  );

  console.log('\n' + kleur.bold('🔗 Resources:'));
  console.log(`  Walrus Docs:   ${kleur.cyan('https://docs.walrus.site')}`);
  console.log(`  Sui Docs:      ${kleur.cyan('https://docs.sui.io')}`);
  console.log(
    `  Sui Faucet:    ${kleur.cyan('https://faucet.testnet.sui.io')}`
  );

  console.log('\n' + kleur.bold('💡 Tips:'));
  console.log(
    `  - Copy ${kleur.cyan('.env.example')} to ${kleur.cyan('.env')}`
  );
  console.log(`  - Install Sui Wallet browser extension`);
  console.log(`  - Get testnet SUI from the faucet`);

  console.log('\n' + kleur.green('━'.repeat(60)) + '\n');
}

/**
 * Display error message with recovery steps
 */
export function displayError(error: Error, context: Context): void {
  console.log('\n' + kleur.red('━'.repeat(60)));
  console.log(kleur.bold().red('  ❌ Project creation failed'));
  console.log(kleur.red('━'.repeat(60)));

  console.log('\n' + kleur.bold('Error:'));
  console.log(`  ${kleur.red(error.message)}`);

  console.log('\n' + kleur.bold('Recovery Steps:'));
  console.log(`  ${kleur.gray('1.')} cd ${kleur.cyan(context.projectName)}`);
  console.log(
    `  ${kleur.gray('2.')} ${kleur.cyan(`${context.packageManager} install`)}`
  );
  console.log(
    `  ${kleur.gray('3.')} Try running ${kleur.cyan(getRunCommand(context.packageManager, 'dev'))}`
  );

  console.log('\n' + kleur.bold('Need Help?'));
  console.log(
    `  Report issues: ${kleur.cyan('https://github.com/your-org/walrus-starter-kit/issues')}`
  );

  console.log('\n' + kleur.red('━'.repeat(60)) + '\n');
}
```

### Step 5: Main Post-Install Orchestrator (1.5 hours)

6. Create `post-install/index.ts`:

```typescript
import { logger } from '../utils/logger.js';
import { installDependencies } from './package-manager.js';
import { initializeGit, createInitialCommit } from './git.js';
import { validateProject } from './validator.js';
import { displaySuccess, displayError } from './messages.js';
import type { Context } from '../types.js';

export interface PostInstallOptions {
  context: Context;
  projectPath: string;
  skipInstall?: boolean;
  skipGit?: boolean;
  skipValidation?: boolean;
}

export interface PostInstallResult {
  success: boolean;
  installed: boolean;
  gitInitialized: boolean;
  validated: boolean;
  error?: Error;
}

/**
 * Run post-install tasks
 */
export async function runPostInstall(
  options: PostInstallOptions
): Promise<PostInstallResult> {
  const {
    context,
    projectPath,
    skipInstall = false,
    skipGit = false,
    skipValidation = false,
  } = options;

  const result: PostInstallResult = {
    success: true,
    installed: false,
    gitInitialized: false,
    validated: false,
  };

  try {
    // Step 1: Install dependencies
    if (!skipInstall) {
      const installResult = await installDependencies(
        projectPath,
        context.packageManager
      );
      result.installed = installResult.success;

      if (!installResult.success) {
        logger.warn(
          '⚠️  Dependency installation failed, but project was created'
        );
        logger.info('💡 You can install manually by running:');
        logger.info(`   cd ${context.projectName}`);
        logger.info(`   ${context.packageManager} install`);
      }
    }

    // Step 2: Initialize git
    if (!skipGit) {
      const gitResult = await initializeGit(projectPath);
      result.gitInitialized = gitResult.success;

      if (gitResult.success) {
        const commitResult = await createInitialCommit(projectPath);
        if (!commitResult.success) {
          logger.warn('⚠️  Initial commit failed, but git repo was created');
        }
      }
    }

    // Step 3: Validate project
    if (!skipValidation && result.installed) {
      const validationResult = await validateProject(projectPath);
      result.validated = validationResult.valid;

      if (!validationResult.valid) {
        logger.warn('⚠️  Project validation failed:');
        validationResult.errors.forEach((err) => logger.warn(`   - ${err}`));
      }
    }

    // Display success message
    displaySuccess(context);

    return result;
  } catch (error) {
    result.success = false;
    result.error = error as Error;

    displayError(error as Error, context);

    return result;
  }
}
```

### Step 6: Integration with Main CLI (45 min)

7. Update `packages/cli/src/index.ts`:

```typescript
// ... existing imports ...
import { runPostInstall } from './post-install/index.js';

// ... inside .action() handler, after generateProject ...

// Post-install tasks
const postInstallResult = await runPostInstall({
  context,
  projectPath: context.projectPath,
  skipInstall: options.skipInstall, // Allow skip via flag
  skipGit: options.skipGit,
  skipValidation: options.skipValidation,
});

if (!postInstallResult.success) {
  logger.warn('⚠️  Post-install tasks completed with warnings');
}
```

8. Add CLI flags for skipping steps:

```typescript
program
  // ... existing options ...
  .option('--skip-install', 'Skip npm install', false)
  .option('--skip-git', 'Skip git initialization', false)
  .option('--skip-validation', 'Skip project validation', false);
```

## Todo List

- [ ] Add `cross-spawn` dependency
- [ ] Create `post-install/package-manager.ts`
- [ ] Create `post-install/git.ts`
- [ ] Create `post-install/validator.ts`
- [ ] Create `post-install/messages.ts`
- [ ] Create `post-install/index.ts`
- [ ] Update `src/index.ts` to call post-install
- [ ] Add skip flags to CLI
- [ ] Test install with all package managers
- [ ] Test git initialization
- [ ] Test validation checks
- [ ] Test success/error messages
- [ ] Test skip flags

## Success Criteria

### Functional Tests

- [ ] Dependencies install successfully with npm/pnpm/yarn/bun
- [ ] Git repository initializes
- [ ] Initial commit created
- [ ] Validation catches missing dependencies
- [ ] Validation checks TypeScript compilation
- [ ] Success message shows correct commands
- [ ] Skip flags work correctly

### Integration Tests

```bash
# Full flow
create-walrus-app test-app --sdk mysten --framework react --use-case simple-upload

# Should:
# 1. Generate project
# 2. Install dependencies
# 3. Initialize git
# 4. Create commit
# 5. Validate project
# 6. Show success message

cd test-app
npm run dev  # Should work immediately
```

### Edge Cases

- [ ] Install fails → Show manual steps
- [ ] Git not installed → Skip gracefully
- [ ] TypeScript errors → Warn but don't fail
- [ ] Skip install flag → Only generate files

## Risk Assessment

### Potential Blockers

1. **Package manager not found**: User has different PM than detected
   - **Mitigation**: Default to npm, allow override flag
2. **Install hangs**: Network issues
   - **Mitigation**: Add timeout, allow skip
3. **Git commit fails**: No git user configured
   - **Mitigation**: Warn user, provide instructions

### Contingency Plans

- If install fails: Provide manual install command
- If validation fails: Warn but don't block
- If git fails: Project still usable

## Security Considerations

### Phase-Specific Concerns

1. **Command injection**: Malicious project names in spawn
   - **Hardening**: Use array args, not shell string
2. **Path traversal**: Project path outside CWD
   - **Mitigation**: Validate project path
3. **Arbitrary code execution**: Malicious package.json scripts
   - **Mitigation**: Templates are trusted (bundled)

### Hardening Measures

```typescript
// Always use array args, never shell concatenation
spawn('npm', ['install'], { cwd: projectPath }); // ✅ Safe
// NOT: spawn(`cd ${projectPath} && npm install`); // ❌ Unsafe
```

## Next Steps

After Phase 8 completion:

1. **Testing**: E2E tests for all flows
2. **Documentation**: Update README with usage
3. **Publishing**: Publish to npm registry
4. **Monitoring**: Track usage analytics

### Open Questions

- Add telemetry for install success rate? (Decision: Future feature, privacy first)
- Support offline mode? (Decision: Future feature)
- Parallel install and git init? (Decision: No, sequential for clarity)
````

## File: plan.md

````markdown
---
title: 'Walrus Starter Kit Implementation'
description: 'Production-ready interactive CLI scaffolder for Walrus applications'
status: pending
priority: P1
effort: 48h
branch: main
tags: [cli, scaffolding, monorepo, walrus, sui]
created: 2026-01-17
---

# Walrus Starter Kit - Implementation Plan

**Target:** `npm create walrus-app@latest` - Production-ready CLI scaffolder  
**Timeline:** 8 days (48 hours dev time)  
**Budget:** $1,500  
**Architecture:** Monorepo + Base/Layer + Adapter Pattern

## MVP Scope

**1 SDK × 1 Framework × 3 Use Cases** (expandable to 3×3×3)

- **Primary SDK:** @mysten/walrus (testnet stable)
- **Primary Framework:** React + Vite
- **Use Cases:** Simple Upload, File Gallery, DeFi/NFT Metadata

## Critical Success Factors

✅ **Adapter Pattern** - SDK-agnostic use case layers  
✅ **Deep JSON Merge** - Zero package.json conflicts  
✅ **Compatibility Matrix** - Runtime validation  
✅ **Post-Install Checks** - Zero broken templates  
✅ **Progressive Enhancement** - Add SDKs/frameworks modularly

## Implementation Phases

### Phase 1: Monorepo Foundation ⏱️ 4h

**Status:** pending | **Priority:** High  
Setup pnpm workspace, root configs, directory structure  
📄 [Detailed Plan](./phase-01-monorepo-foundation.md)

### Phase 2: CLI Engine Core ⏱️ 6h

**Status:** pending | **Priority:** High  
Commander + prompts, context object, validation system  
📄 [Detailed Plan](./phase-02-cli-engine-core.md)

### Phase 3: Template Base Layer ⏱️ 5h

**Status:** pending | **Priority:** High  
Adapter interface, base directory structure, core configs  
📄 [Detailed Plan](./phase-03-template-base-layer.md)

### Phase 4: SDK Layer (@mysten/walrus) ⏱️ 6h

**Status:** pending | **Priority:** High  
Walrus client, upload/download adapters, type definitions  
📄 [Detailed Plan](./phase-04-sdk-layer.md)

### Phase 5: Framework Layer (React+Vite) ⏱️ 6h

**Status:** pending | **Priority:** High  
React template, Vite config, component architecture  
📄 [Detailed Plan](./phase-05-framework-layer.md)

### Phase 6: Use Case Layers ⏱️ 8h

**Status:** pending | **Priority:** High  
Simple Upload, File Gallery, DeFi/NFT templates  
📄 [Detailed Plan](./phase-06-use-case-layers.md)

### Phase 7: Template Generation Engine ⏱️ 6h

**Status:** pending | **Priority:** High  
Deep merge, file copying, layer composition  
📄 [Detailed Plan](./phase-07-generation-engine.md)

### Phase 8: Post-Install & Validation ⏱️ 7h

**Status:** pending | **Priority:** Medium  
Package manager detection, dependency install, validation  
📄 [Detailed Plan](./phase-08-post-install.md)

## Critical Path

```
Phase 1 → Phase 2 → Phase 7 (parallel with 3-6)
         ↓
Phase 3 → Phase 4 → Phase 5 → Phase 6
         ↓                      ↓
         └──────────────────────→ Phase 8
```

**Parallel Opportunities:**

- Phases 3-6 can be developed simultaneously after Phase 2
- Phase 7 implementation can start alongside template development

## Risk Mitigation

| Risk                  | Mitigation                           |
| --------------------- | ------------------------------------ |
| SDK API changes       | Pin versions, mock interfaces        |
| Template conflicts    | Deep merge testing, validation suite |
| CLI complexity        | Progressive prompts, defaults        |
| Cross-platform issues | Test on Linux/macOS/Windows          |

## Success Criteria

- [ ] `npm create walrus-app@latest` works end-to-end
- [ ] All 3 use case templates generate successfully
- [ ] Post-install validation passes for all templates
- [ ] Templates run `npm run dev` without errors
- [ ] Documentation complete (README + CONTRIBUTING)
- [ ] E2E tests cover happy path + error cases

## Research Context

This plan synthesizes findings from:

- [Next.js App Router Research](../reports/researcher-260117-1353-nextjs-app-router.md)
- [CLI Scaffolding Research](../reports/researcher-260117-1353-cli-scaffolding.md)
- [pnpm Monorepo Research](../reports/researcher-260117-1353-pnpm-monorepo.md)
- [Mysten Walrus SDK Research](../reports/researcher-260117-1353-mysten-walrus-sdk.md)
- [Product Requirements Document](../../POC/PRD.md)

## Next Steps

1. Review each phase file for detailed implementation steps
2. Set up development environment (Node 18+, pnpm 9+)
3. Start with Phase 1: Monorepo Foundation
4. Track progress using phase status updates
````
