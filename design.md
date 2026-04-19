# FetchRecipe Design System

This is the design styleguide for FetchRecipe. Every page, component, and piece of UI should follow these guidelines. The aesthetic is editorial and refined — inspired by Kinfolk magazine. Restraint is the guiding principle: generous whitespace, black typography on mostly white backgrounds, and a serif/sans-serif pairing that feels considered, not generic.

---

## Typography

### Font stack

- **Display / Headlines:** Tagesschrift (Google Fonts) — a hand-drawn editorial serif with organic, slightly irregular character. It has a single weight and no italic cut. Its personality comes from its texture, not from weight or style variation.
- **Body / UI:** Satoshi (Fontshare) — a clean, geometric sans-serif with personality. Use weight 400 for body text, 500 for emphasis and buttons. Never use weight 300 — it's too light for comfortable reading.

### Import

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Tagesschrift&display=swap');

/* Fontshare */
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');
```

### Hierarchy

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Page headline (h1) | Tagesschrift | 48–56px | 400 | One per page. |
| Section headline (h2) | Tagesschrift | 28–32px | 400 | Recipe titles, blog post titles |
| Section label (h3) | Tagesschrift | 16px | 400 | "Ingredients", "Method" |
| Feature title | Tagesschrift | 18px | 400 | Short descriptive titles |
| Body text | Satoshi | 15–16px | 400 | Primary reading text |
| Small text / hints | Satoshi | 13px | 400 | Eyebrows, meta info, hints |
| Buttons | Satoshi | 14px | 500 | All interactive controls |
| Navigation | Satoshi | 14px | 400 | Header links |

### Rules

- All text is black (#1A1A1A). No gray text anywhere — not for secondary text, not for labels, not for hints. The hierarchy comes from size and font choice, not color.
- Never use all-caps or uppercase text-transform. Not for labels, not for eyebrows, not for navigation, not for anything.
- Never use font-weight 300 on Satoshi body text. It's too thin.
- Tagesschrift has only one weight and no italic. Do not attempt to bold or italicize it. Its character comes from its organic, hand-drawn texture — that's enough.
- Never use italics on body text, labels, or UI elements.
- Max line width for body text: 65ch.
- Line height: 1.6 for body text, 1.15 for headlines.
- Letter-spacing: -0.01em on large Tagesschrift headlines. 0.02em on small Satoshi labels.

---

## Color

The palette is intentionally minimal. This is a nearly monochrome design with one warm neutral accent.

### Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--black` | #1A1A1A | All text, primary buttons, borders on hover |
| `--white` | #FFFFFF | Primary background, recipe cards |
| `--cream` | #DCDED6 | Accent background for sections (used sparingly) |
| `--gray-border` | #D4D4D4 | Borders, dividers, input outlines |
| `--inline-bg` | #F0F0EC | Background for inline ingredient quantity tags |

### Rules

- The primary background is white. Most of the page should be white.
- Use cream (#DCDED6) as a background for occasional sections to create rhythm — for example, the extracted recipe card area. Don't overuse it.
- Never use cream for text, borders, or UI elements. It's only a background color.
- All borders are 0.5px solid var(--gray-border). On hover, borders transition to var(--black).
- No gradients, no shadows, no glows, no blur effects. The design gets its depth from whitespace, typography, and the white/cream interplay.
- No colored accents, no blues, no greens, no brand colors beyond black and cream. If we introduce an accent color later, it will be a single restrained choice.

---

## Layout and spacing

### General principles

- Generous whitespace everywhere. When in doubt, add more space.
- Max content width: 720px for text-heavy pages (homepage hero, blog posts). 600px for recipe cards. 800px for feature grids.
- Page padding: 48px horizontal on desktop, 20px on mobile.
- Section spacing: 80px between major sections.
- The design is mobile-first. Over 60% of recipe searches happen on phones.

### Grid

- Use CSS Grid for multi-column layouts.
- Feature sections: 3 columns on desktop, 1 column on mobile.
- Always collapse to single column below 768px.

### Containers

- Recipe cards: white background, no border-radius, no shadow. Padding 48–56px.
- Input rows: no border-radius. Thin 0.5px border. Input and button sit flush together.
- No card shadows anywhere in the design. Elevation comes from background color changes (white card on cream section).

---

## Components

### Navigation

- Logo left (Tagesschrift, 18px, letter-spacing 0.04em), links right (Satoshi, 14px, weight 400).
- Bottom border: 0.5px solid var(--gray-border).
- No hamburger menu on mobile — collapse to essential links only.

### URL input + button

- Input and button share a single 0.5px border container, no border-radius.
- Input: Satoshi 14px, weight 400. Placeholder color #999.
- Button: Satoshi 14px, weight 500. Black background, white text.
- On hover: border transitions to black. Button background lightens slightly to #333.
- On active/press: button scales to 0.98 (subtle tactile feedback).

### Recipe card

The recipe card uses a structured editorial layout inspired by cookbook design. White background on cream section for contrast. No border-radius, no shadow. Padding 48–56px on desktop, 32px 24px on mobile.

**Header area — two columns:**
- Left column: recipe image in 4:3 aspect ratio. If no image is available from extraction, omit the image entirely (don't show a placeholder).
- Right column, vertically centered beside the image:
  - Title: Tagesschrift 32px.
  - Below the title: three metadata boxes in a horizontal row, each with a 0.5px border. Each box contains a small label (Satoshi 13px, weight 400 — e.g., "Prep", "Cook", "Serves") and the value below it (Satoshi 15px, weight 500 — e.g., "10 minutes", "40 minutes", "4"). Boxes have equal width, sitting flush next to each other.
  - Source site name: small bordered badge (0.5px border, padding 4px 10px) below the metadata boxes. Satoshi 13px.
- On mobile: stack vertically — image on top (full width), then title and metadata below.

**Body area — two columns, separated by whitespace:**
- Left column (~40% width): Ingredients
  - Section title "Ingredients": Tagesschrift 16px.
  - Ingredient list: no bullets. Each item on its own line with a leading dash or em-dash. Quantity and name together as a single string (e.g., "500g cherry tomatoes"). Satoshi 15px, weight 400. Items separated by generous line spacing (not borders in this layout).
- Right column (~55% width): Method/Instructions
  - Section title "Method": Tagesschrift 16px.
  - Numbered steps with Tagesschrift step numbers (16px). Step text in Satoshi 15px, weight 400. Inline ingredient quantities appear as subtle tags with --inline-bg (#F0F0EC) background, Satoshi 13px weight 500.
  - Steps separated by generous vertical spacing (20–24px between steps).
- On mobile: stack vertically — ingredients first, then instructions below.
- Between the two columns on desktop: use whitespace as the separator (no vertical border line needed). A gap of about 48–64px between columns.

**Footer area:**
- Action buttons span full width below both columns: "Print recipe" (primary, black bg) and "Save recipe" (secondary, border only). Separated from body by a 0.5px border-top with 28px padding above.

### Buttons

- Primary: black background, white text, no border-radius. Padding 12px 24px. Satoshi 14px weight 500.
- Secondary: transparent background, 0.5px border. Same sizing as primary. On hover, border transitions to black.
- All buttons: transition 200ms ease-out. Active state: scale(0.98).

### Dividers

- Short centered line: 40px wide, 0.5px, var(--gray-border). Used between sections.
- Full-width line: 0.5px border-bottom. Used for list items, nav, footer.

### Loading state

- For the extraction tool (5–35 second wait): show an animated progress indicator. Use a simple horizontal line that slowly fills, paired with rotating text messages:
  - "Fetching the page..."
  - "Reading the recipe..."
  - "Extracting ingredients..."
  - "Almost there..."
- Keep the animation subtle. A thin line works better than a spinner for this editorial aesthetic.
- Reserve space for the recipe card output area (prevents layout shift when results appear).

### Error state

- Display errors inline below the input, not in a modal or alert.
- Error text: Satoshi 14px, weight 400, black. Preceded by a simple dash or "—" character.
- Example: "— No recipe found on this page. Make sure the URL points to a page with a recipe."

### Empty state

- When no recipe has been extracted yet, the area below the input should feel intentionally empty — not broken. The whitespace is the empty state.

---

## Motion

The motion philosophy is restrained. Animations serve function, not decoration.

### Easing

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
```

Use this for all transitions. Never use linear or ease-in for UI animations.

### Durations

| Element | Duration |
|---------|----------|
| Button hover/active | 100–160ms |
| Border color transitions | 200ms |
| Content fade-in on load | 300ms |
| Recipe card appearance | 300ms (opacity + translateY 8px) |

### Rules

- Never animate keyboard-initiated actions.
- The extraction button press should feel instant — no animation delay.
- When the recipe card appears after extraction, fade it in with a subtle upward slide (8px translateY, 300ms ease-out).
- Stagger ingredient and instruction items on first appearance (30–50ms delay between items).
- No decorative animations, no parallax, no scroll-triggered effects. The content is the experience.
- Respect prefers-reduced-motion — fall back to opacity-only transitions.

---

## Print styles

When a user clicks "Print recipe", the printed output should be:

- Recipe title, meta info, ingredients, and instructions only.
- No navigation, no footer, no buttons, no branding clutter.
- Black text on white background.
- Tagesschrift for the title, Satoshi for everything else.
- Clean, single-column layout that fits on 1–2 pages.

---

## Responsive breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Single column. Padding 20px. Input stacks above button if needed. |
| Tablet | 768–1024px | Content areas narrow slightly. Same layout structure. |
| Desktop | > 1024px | Full layout as designed. |

---

## What this design is not

- Not playful or whimsical. No rounded corners, no bouncy animations, no emoji, no illustrations.
- Not a SaaS dashboard. No cards with shadows, no colored badges, no data-dense layouts.
- Not generic. No Inter, no Roboto, no purple gradients, no hero images, no stock photography.

This is an editorial tool. It should feel like a beautifully typeset cookbook that happens to be interactive.
