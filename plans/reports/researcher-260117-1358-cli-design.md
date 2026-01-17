# CLI Output Design & Terminal UX

## 1. Color Palette (ANSI-Safe)

**Primary Colors:**

- **Success**: `#00D787` (Green 42) - Bright, positive
- **Error**: `#FF5F87` (Red 204) - Visible but not harsh
- **Warning**: `#FFD700` (Yellow 220) - Clear attention
- **Info**: `#00D7FF` (Cyan 45) - Neutral information
- **Subtle**: `#6C7086` (Gray 243) - Secondary text

**Grayscale:**

- **Primary Text**: `#CDD6F4` (White 252)
- **Dim Text**: `#6C7086` (Gray 243)
- **Background**: Terminal default

**Tool Choice:** **kleur** (smallest, fastest, zero dependencies)

## 2. Progress Indicators

**Spinners (ora patterns):**

```
⠋ Loading...
⠙ Loading...
⠹ Loading...
⠸ Loading...
⠼ Loading...
⠴ Loading...
⠦ Loading...
⠧ Loading...
⠇ Loading...
⠏ Loading...
```

**Step Indicators:**

```
[1/6] Validating inputs...
[2/6] ✓ Creating directory
[3/6] ⠋ Copying templates...
```

**Progress Pattern:**

```
✓ Dependencies installed (234 packages)
⠋ Building project...
```

## 3. Message Templates

**Success:**

```
✅ Success! Project created at ./my-walrus-app

Next steps:
  cd my-walrus-app
  pnpm install
  pnpm dev
```

**Error:**

```
❌ Error: Directory "my-app" already exists

Suggestion:
  • Choose a different name
  • Remove existing directory: rm -rf my-app
```

**Warning:**

```
⚠️  Missing .env file

Creating .env.example with required variables:
  VITE_WALRUS_NETWORK=testnet
  VITE_SUI_NETWORK=testnet
```

**Info:**

```
ℹ️  Using pnpm (detected from user agent)
```

## 4. Interactive Prompt Styling (prompts library)

**Question Format:**

```
? What is your project name? › my-walrus-app
                              ▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

**Select List:**

```
? Select SDK:
❯ @mysten/walrus (Official - Recommended)
  @tusky-io/ts-sdk
  @hibernuts/walrus-sdk
```

**Multiselect:**

```
? Select optional features: (Space to select)
◉ Tailwind CSS
◯ Analytics (Blockberry)
```

**Validation Feedback:**

```
? Project name: › my app
✗ Invalid: Use lowercase letters, numbers, and hyphens only
? Project name: › my-walrus-app
✓ Valid project name
```

## 5. Example Output Flow

```bash
$ npm create walrus-app@latest

╭─────────────────────────────────────╮
│                                     │
│   🐋 Walrus Starter Kit v0.1.0     │
│   Interactive Project Scaffolder    │
│                                     │
╰─────────────────────────────────────╯

? Project name: › my-walrus-app
✓ Valid project name

? Select SDK:
❯ @mysten/walrus (Official - Recommended)

? Select framework:
❯ React + Vite

? Select use case:
❯ Simple Upload

? Add Tailwind CSS? › Yes

? Add analytics? › No

────────────────────────────────────────

Creating project at ./my-walrus-app

[1/6] ✓ Validating configuration
[2/6] ✓ Creating directory structure
[3/6] ⠋ Copying base template...
[3/6] ✓ Copied base template
[4/6] ⠋ Applying SDK layer (mysten)...
[4/6] ✓ Applied SDK layer
[5/6] ⠋ Merging package.json...
[5/6] ✓ Merged dependencies
[6/6] ⠋ Installing dependencies...
[6/6] ✓ Installed 127 packages in 12s

────────────────────────────────────────

✅ Success! Your Walrus app is ready.

Next steps:

  1. Navigate to your project:
     cd my-walrus-app

  2. Copy environment variables:
     cp .env.example .env

  3. Update .env with your configuration

  4. Start development server:
     pnpm dev

Happy building! 🚀

────────────────────────────────────────

Documentation: https://github.com/walrus-starter-kit
Report issues: https://github.com/walrus-starter-kit/issues
```

## 6. Key Insights

1. **Minimal Color Use**: Only 4 semantic colors (success, error, warning, info). Overuse creates noise.

2. **Progressive Disclosure**: Show current step prominently, dim completed steps, hide future steps until relevant.

3. **Emoji Consistency**:
   - ✅ Success (completed action)
   - ❌ Error (blocking issue)
   - ⚠️ Warning (attention needed)
   - ℹ️ Info (helpful context)
   - 🐋 Branding (Walrus)

4. **Box Drawing**: Use simple ASCII boxes, not complex Unicode (compatibility):

   ```
   ╭─╮  ✓ Works everywhere
   │ │
   ╰─╯
   ```

5. **Recoverable Errors**: Always provide actionable suggestions with errors.

## Sources

- [create-next-app CLI patterns](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- [create-vite terminal output](https://github.com/vitejs/vite/tree/main/packages/create-vite)
- [kleur documentation](https://github.com/lukeed/kleur)
- [ora spinners](https://github.com/sindresorhus/ora)
- [prompts library](https://github.com/terkelg/prompts)
