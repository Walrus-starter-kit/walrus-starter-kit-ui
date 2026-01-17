# Modern React Component Design for Web3

## 1. Design Style Direction

**"Deep Ocean Glass"**
A refined blend of **OLED-friendly Dark Mode** and **Functional Glassmorphism**. This aesthetic emphasizes data density and trustworthiness while maintaining a modern, futuristic feel suitable for the Walrus/Sui ecosystem.

- **Why:** "Glass" layers provide depth for z-indexing (modals over dashboards) without clutter. Deep dark backgrounds reduce eye strain for power users.
- **Vibe:** Technical, Immutable, Fluid.

## 2. Color Palette

**Theme:** "Abyssal Plain" (Dark Blue-Grey with Electric Cyan accents)

| Role           | Hex       | Tailwind Name | Usage                                            |
| -------------- | --------- | ------------- | ------------------------------------------------ |
| **Background** | `#020617` | `slate-950`   | Main app background (Deepest depth)              |
| **Surface**    | `#1E293B` | `slate-800`   | Cards, sidebars (often with 50-80% opacity)      |
| **Primary**    | `#06B6D4` | `cyan-500`    | Primary actions, active states (Walrus identity) |
| **Secondary**  | `#3B82F6` | `blue-500`    | Secondary links, information highlights          |
| **Accent**     | `#8B5CF6` | `violet-500`  | Gradient stops, special NFT/Blob highlights      |
| **Text Main**  | `#F8FAFC` | `slate-50`    | Headings, primary content                        |
| **Text Muted** | `#94A3B8` | `slate-400`   | Meta-data, labels, descriptions                  |
| **Border**     | `#334155` | `slate-700`   | Subtle separation lines                          |

## 3. Typography

**Pairing Strategy:** Geometric Headings + Legible Body + Tech Mono

1.  **Headings: [Outfit](https://fonts.google.com/specimen/Outfit)**
    - _Style:_ Geometric sans-serif, modern, approachable.
    - _Weights:_ SemiBold (600), Bold (700).
2.  **Body: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)**
    - _Style:_ Humanist sans-serif, excellent readability, modern tech feel.
    - _Weights:_ Regular (400), Medium (500).
3.  **Data/Code: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)**
    - _Style:_ Monospace with ligatures, distinct characters for addresses/IDs.
    - _Weights:_ Regular (400).

## 4. Component Designs

### Upload Zone (The "Drop")

- **State:** Dashed border (`border-dashed border-2 border-slate-700`) that lights up (`border-cyan-500/50`) on drag-over.
- **Visual:** Inner subtle radial gradient glow to guide the eye.
- **Content:** Large icon + "Drag & Drop or Click to Upload" + Max size hint.

### File Preview Cards ("Blob Cards")

- **Structure:** `aspect-square` grid items.
- **Style:** Glass finish (`bg-slate-800/40 backdrop-blur-sm`).
- **Media:** Object-cover image/video preview. If non-media, show file-type icon.
- **Overlay:** On hover, slide up meta-data (Blob ID, Size) with a "Copy ID" action.

### Connect Wallet Button

- **Style:** Gradient border (Cyan to Violet) or solid Primary color.
- **Format:** Pill-shaped (`rounded-full`).
- **Content:** Truncated address (`0x...1234`) + Identicon/Avatar when connected.

### Transaction Status

- **Success:** Green ring pulse animation + "Transaction Confirmed" toast.
- **Pending:** Rotating spinner (Cyan/Blue gradient) + "Finalizing on Sui...".

## 5. Micro-interactions

- **Hover:** `transform: translateY(-2px)` + `shadow-lg` (Cyan tinted) for interactive cards.
- **Loading:** Skeleton screens (`animate-pulse` bg-slate-800) instead of spinners for initial load.
- **Copying:** When clicking Blob ID, icon switches to "Checkmark" instantly for 2s (positive feedback).
- **Error:** Subtle "Shake" animation (x-axis translation) + Red border glow for failed uploads.

## 6. Key Insights

1.  **Depth over Flatness:** Use subtle borders (`border-white/5`) and backdrop blur to create hierarchy, distinguishing "local" vs "on-chain" data.
2.  **Data First:** Prioritize the display of Blob IDs and File Sizes with monospace fonts—this is a storage tool, precision matters.
3.  **Trust Signals:** Use consistent, calm blue/cyan hues for success/active states. Avoid aggressive "alert" colors unless critical errors occur.

## Sources

- **Trends:** Glassmorphism 2025/2026 predictions for Data Dashboards.
- **Typography:** Google Fonts "Tech" trending pairings (Outfit/Jakarta).
- **Color:** Tailwind CSS Slate/Cyan/Blue scales (standard for modern React stacks).
- **Ecosystem:** Aligned with Sui/Walrus branding (water/marine themes).
