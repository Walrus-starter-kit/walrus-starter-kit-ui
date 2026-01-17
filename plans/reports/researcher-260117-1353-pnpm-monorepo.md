# pnpm Workspaces Monorepo for CLI Scaffolder

## 1. Workspace Configuration

For a CLI that scaffolds code, **isolate templates from workspace logic**. Templates often contain placeholders (e.g., `<%= name %>`) or intentional syntax errors (until generated) that break standard build tools.

**`pnpm-workspace.yaml`**:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  # EXCLUDE templates to prevent pnpm from trying to link/build them
  # - "!templates/**"
```

**`package.json` (Root)**:

- **Shared Dependencies**: `typescript`, `eslint`, `prettier` (Dev dependencies).
- **Engine**: Enforce strict Node/pnpm versions.

## 2. Monorepo Structure

Adopt a strict separation between **Tooling** (logic) and **Assets** (templates).

```text
├── pnpm-workspace.yaml
├── package.json          # Root configs, scripts
├── packages/
│   ├── cli/              # The scaffolder logic (published)
│   └── core/             # Shared utilities (optional)
├── templates/            # RAW ASSETS (Excluded from workspace)
│   ├── base/             # The "Skeleton" (minimal working app)
│   └── layers/           # The "Muscles" (features: auth, db, docker)
└── examples/             # Generated output for testing (Included in workspace)
```

## 3. Template Management

**Strategy**: Treat templates as **static resources**, not active packages.

- **Storage**: Store inside `packages/cli/templates` OR at root `templates/` and copy to `packages/cli/dist/templates` during build.
- **Base + Layer Architecture**:
  - **Base**: A complete directory structure.
  - **Layers**: Partial directories overlayed on Base. CLI uses deep-merge logic to combine `package.json` and file trees.
- **Versioning**: Lock template versions to the CLI version. `CLI v1.2` always scaffolds `Templates v1.2`.
- **Exclusion**: Ensure `.npmignore` in `packages/cli` _includes_ the `templates` folder so they are published with the package.

## 4. CLI Package Setup

Enable `npm create` compatibility and efficient local dev.

**`packages/cli/package.json`**:

```json
{
  "name": "create-walrus-app",
  "version": "0.1.0",
  "bin": {
    "create-walrus-app": "./dist/index.js"
  },
  "files": [
    "dist",
    "templates" // Crucial: Include templates in published package
  ]
}
```

- **Local Dev**: Run `pnpm link --global` inside `packages/cli`. Then run `create-walrus-app` anywhere.
- **Testing**: Use a local script to run the CLI against `templates/` and output to `examples/test-app`.

## 5. Key Insights

1.  **Templates are Data**: Do not try to make template folders valid npm packages in the workspace. It creates dependency hell.
2.  **Test the Output**: Don't lint templates. Lint the _project generated_ by the templates in a CI step.
3.  **Single Publish**: Publish the CLI package containing the templates. Avoid publishing templates as separate npm packages unless they are standalone libraries.
4.  **Layer Composition**: Use "Convention over Configuration". If Layer "auth" exists, overlay it. Don't complex config files.

## Sources

- **pnpm Docs**: Workspaces configuration.
- **Create-Turbo**: Pattern of embedding templates within the CLI package.
- **Vercel Examples**: Monorepo structure for generators.
