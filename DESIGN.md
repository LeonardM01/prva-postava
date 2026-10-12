---
name: Prva postava
description: Turf, the visual world of a marketplace where lower-league Croatian footballers list themselves under a position and clubs search that list.
colors:
  signal: '#1f5c3f'
  signal-deep: '#174a32'
  mist: '#f7f6f1'
  card: '#ffffff'
  line: '#e3e1d8'
  ink: '#141a16'
  muted: '#5e655f'
  tint: '#e6efe9'
  amber: '#e0a22e'
  amber-wash: '#fff1cf'
  red: '#b9432a'
  board-glow: '#29734f'
  band-error: '#f2a59b'
typography:
  display:
    fontFamily: 'Manrope Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '38px (60px from md)'
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: '-0.025em'
  headline:
    fontFamily: 'Manrope Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '32px (40px from lg)'
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: '-0.025em'
  score:
    fontFamily: 'Manrope Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '56px (72px from lg)'
    fontWeight: 800
    lineHeight: 1
    letterSpacing: '-0.03em'
  title:
    fontFamily: 'Manrope Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '28px'
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: '-0.02em'
  stat:
    fontFamily: 'Manrope Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '24px (32px from lg)'
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: '-0.02em'
  row-score:
    fontFamily: 'Manrope Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '20px'
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: '-0.02em'
  body-large:
    fontFamily: 'IBM Plex Sans Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '17px'
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: 'tnum'
  body:
    fontFamily: 'IBM Plex Sans Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '15px'
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: 'tnum'
  meta:
    fontFamily: 'IBM Plex Sans Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '13px'
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: 'tnum'
  label:
    fontFamily: 'IBM Plex Sans Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '10px'
    fontWeight: 600
    lineHeight: 'normal'
    letterSpacing: '0.06em'
rounded:
  tag: '4px'
  badge: '6px'
  md: '8px'
  lg: '10px'
  button: '12px'
  xl: '14px'
  sheet: '16px'
  plate: '20px'
  pill: '9999px'
spacing:
  row-gap: '12px'
  gutter-phone: '20px'
  gutter-tablet: '32px'
  gutter-wide: '64px'
  section: '24px'
  columns: '40px'
components:
  button-primary:
    backgroundColor: '{colors.signal}'
    textColor: '{colors.card}'
    rounded: '{rounded.button}'
    padding: '0 18px'
    height: '44px (40px from lg)'
  button-primary-hover:
    backgroundColor: '{colors.signal-deep}'
  button-secondary:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.button}'
    padding: '0 18px'
    height: '44px (40px from lg)'
  button-secondary-active:
    backgroundColor: '{colors.tint}'
  chip:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    padding: '0 12px'
    height: '44px (32px from lg)'
  chip-applied:
    backgroundColor: '{colors.tint}'
    textColor: '{colors.signal}'
    rounded: '{rounded.pill}'
  position-badge:
    backgroundColor: '{colors.signal}'
    textColor: '{colors.card}'
    rounded: '{rounded.badge}'
    size: '28x24px (30x26px from board)'
  promoted-tag:
    backgroundColor: '{colors.amber}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.tag}'
    padding: '2px 5px'
  list-row:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    padding: '8px 12px'
    height: '64px min'
  list-row-promoted:
    backgroundColor: '{colors.amber-wash}'
  list-row-opened:
    backgroundColor: '{colors.tint}'
  initials-mark:
    backgroundColor: '{colors.tint}'
    textColor: '{colors.signal}'
    rounded: '{rounded.pill}'
    size: '56px (72px from lg)'
  highlights-plate:
    backgroundColor: '{colors.signal-deep}'
    textColor: '{colors.card}'
    rounded: '{rounded.plate}'
  sample-strip:
    backgroundColor: '{colors.tint}'
    textColor: '{colors.muted}'
    typography: '{typography.meta}'
    padding: '8px 20px'
  popover-panel:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.xl}'
---

# Design System: Prva postava

## Overview

**Creative North Star: "The Ruled Team Sheet"** (provisional name; the world itself is "Turf")

Turf is a pale, pitch-green world on warm paper. A player is read the way a team sheet is read: names and numbers in a heavy display face, everything else in a quiet working sans, separated by hairline rules rather than boxed into cards. Colour carries meaning, not decoration: green is the product's voice and the position, amber is money, and nothing else competes.

Density is that of a working tool. The demo at `/app` is "Dossier first": a narrow ranked list beside one wide dossier, rather than a data grid or a dashboard of tiles. The landing page carries the same tokens with one heavier set piece, the tactics board, a dark green pitch with chalk lines and player chips. The site is light only (`color-scheme: light`; shadcn `dark:` variants are pinned inert).

Honesty is visual, not only verbal: every demo screen carries the sample label, a paid position is always worded, and no state relies on colour alone.

**Key Characteristics:**

- Warm mist page, white card surfaces, hairline `line` rules between rows and sections.
- Manrope ExtraBold for names, titles and numbers; IBM Plex Sans for all other text; tabular numerals site-wide.
- Signal green for action, position and selection; amber only for Promoted.
- Ruled rows, never boxed content; framing is reserved for a few named objects.
- Pills for chips and switches, 12 px corners for buttons.
- Motion is short opacity and colour; nothing travels in the demo.

**Unresolved, recorded rather than decided:**

- The North Star name above is provisional; only "Turf" and the composition "Dossier first" were named by the owner.
- Landing buttons predate the shared action button and use 8 px (nav, phone menu) and 10 px (CTA submit, fact-sheet button) corners; the demo's shared button uses 12 px. Not yet reconciled.
- The landing's search-results table closes its head and its last row with ink rules (inner rows in `line`); the demo's ranked list uses `line` throughout.
- No highlight clips exist yet; every dossier shows the sample plate.

## Colors

A green-on-paper palette with one warm accent that is reserved for paid placement.

### Primary

- **Signal Green** (signal): primary buttons, position badges, applied-chip text and stroke, the range-rule dot, focus ring, text caret, placeholder value in the composer, initials text.
- **Deep Signal** (signal-deep): primary button hover and pressed; the ground of the tactics board, the CTA band and the highlights plate.

### Secondary

- **Promoted Amber** (amber): the Promoted tag and pill, the star in the promoted honesty bar, the promoted board badge.
- **Amber Wash** (amber-wash): the promoted list row and the promoted honesty bar.

### Neutral

- **Mist** (mist): page background; composer field hover.
- **Card White** (card): top bar, chips, secondary buttons, popovers, text on green.
- **Hairline** (line): every rule, border and divider; input stroke.
- **Ink** (ink): primary text; the overlay behind phone sheets at 30 %.
- **Muted** (muted): secondary text (meta lines, labels, last season). In this project `muted` is a text colour, not shadcn's surface.
- **Tint** (tint): opened list row, applied chip fill, sample strip, switch track, initials mark.
- **Error Red** (red): field error stroke and message.
- **Board Glow** (board-glow): radial glow on the tactics board and highlights plate only; fixed, not a palette role.
- **Band Error** (band-error): error text on the dark CTA band, where `red` would fail contrast.

The brand mark's four dot colours (forward #D0342C, midfield #1F8A4C, defence #2E56D6, keeper #E0A22E) belong to the logo and are not palette tokens.

### Named Rules

**The Amber Is Money Rule.** Amber and amber wash mean Promoted (paid placement) and nothing else. Never use them for warnings, highlights or decoration.

**The Never Colour Alone Rule.** Every coloured state also carries a word, a shape or a ring: the Promoted tag spells "Promoted", the promoted row also carries the tag, the opened row is ringed in signal as well as tinted, and the applied chip changes its stroke as well as its fill.

## Typography

**Display Font:** Manrope Variable (with ui-sans-serif, system-ui)
**Body Font:** IBM Plex Sans Variable (with ui-sans-serif, system-ui)

**Character:** A compact, heavy geometric face for the things a recruiter scans (names, scores, counts) beside a plain technical sans for everything read. Both load Latin and Latin Extended only with `font-display: optional`, so text never shifts after first paint.

### Hierarchy

- **Display** (800, 38 px to 60 px from md, 1.02): the landing hero headline only.
- **Headline** (800, 32 px to 40 px from lg, 1.05, -0.025em): the dossier name; the CTA band headline uses the same cut (32 to 44 px).
- **Score** (800, 56 px to 72 px from lg, 1): the dossier score, captioned "Score" in 13 px muted at 0.06em.
- **Title** (800, 28 px, 1.1): page titles in the demo (Players, the position title, Shortlist, the player seat).
- **Stat** (800, 24 px to 32 px, 1.2): this season's numbers; last season steps back to 20 px in muted.
- **Row score** (800, 20 px, 1.1): the sorted value in a ranked row; also the brand wordmark size.
- **Body large** (Plex 400, 15 px to 17 px, 1.4): the dossier identity line; fact values (500).
- **Body** (Plex 400 to 600, 15 px, 1.3): row names (600), panel titles (600), section heads (600).
- **Meta** (Plex 400, 13 px, 1.3, muted): club and league lines, labels, captions, the sample strip.
- **Label** (Plex 600, 10 px, uppercase, 0.06em): the Promoted tag inside a row, and the landing results table's column heads (11 px, 500).

### Named Rules

**The Names And Numbers Rule.** Manrope ExtraBold is for player names, page titles, scores and stats. Everything else is IBM Plex Sans.

**The Tabular Rule.** Numerals are tabular everywhere (set on `body`), so columns of scores and season numbers align.

## Layout

The page frame is 90rem (1440 px), centred; wider screens do not spread the content. Gutters: 20 px on phones, 32 px from lg (40 px on the landing from md), 64 px from xl.

Breakpoints in use:

- **md** (48rem): the landing's tablet layout.
- **board** (53rem): the full 736 px tactics board fits; below it the board switches to compact chips. Ranked-row badges and the Promoted tag step up here.
- **lg** (64rem): the demo becomes two columns, a 24.5rem (392 px) list beside the dossier with a 40 px gap. Below lg the demo shows the list or the profile, never both, and popovers become bottom sheets.
- **xl** (80rem): dossier actions (Save, Contact) move beside the identity line instead of under it.

The dossier is a single column of ruled sections (identity, score with range rule, facts, seasons, highlights) separated by `line` dividers, 24 to 28 px vertical padding each. Facts and season strips run four across from lg with left rules between cells, two across on phones.

**The 44 Pixel Rule.** Every interactive target is at least 44 px tall below lg: buttons, chips, switch options, close buttons, the brand link. From lg they return to the designed sizes (40 px buttons, 32 px chips).

## Elevation & Depth

Flat by default; depth comes from tone (mist, card, tint) and hairline rules. Shadows appear only on things that float or are physical on the board.

### Shadow Vocabulary

- **Popover** (`0 12px 32px -8px` ink at 16 %): popover panels and phone sheets in the top layer.
- **Switch thumb** (`0 1px 2px` ink at 12 %): the current option in the seat and language switches.
- **Board chip** (`0 6px 16px -4px rgb(8 31 18 / 0.3)`, lifted `0 10px 20px -4px rgb(8 31 18 / 0.38)`): player chips on the landing's tactics board only.
- **Pressed** (`inset 0 2px 4px rgb(0 0 0 / 0.18)`): buttons while pressed, keeping their hover fill.

### Named Rules

**The Float Only Rule.** A shadow means the object sits above the page (a popover, a chip on the board, a switch thumb). Content in the flow never casts one.

## Shapes

Three shape families: pills (chips, switches, the initials mark, the Promoted pill), softly squared controls (buttons 12 px, composer bar, contact note and wide-screen popovers at 14 px, honesty bar and composer fields at 10 px, badges 6 to 7 px, the row tag 4 px), and large rounded plates (tactics board 16 px, highlights plate 20 px, phone sheet top corners 16 px).

**The Ruled Rows Rule.** Content is ruled, not boxed. List rows, dossier sections, facts and stat cells are separated by 1 px `line` rules. Within the list and the dossier the only framed objects are the highlights plate and the initials mark. Controls and overlays (the composer bar, the contact note, popovers, buttons, chips) are framed because they are controls, not content.

## Components

### Buttons

- **Shape:** 12 px corners.
- **Primary:** signal fill, card text, 600 weight, 14 px, 18 px side padding, 44 px tall below lg and 40 px from lg (48 px for full-width phone actions; the landing hero uses 52 px at 17 px).
- **Secondary:** card fill, 1 px line stroke, ink text; hover turns the stroke signal, pressed fills tint.
- **Hover / Press:** 150 ms colour transition; pressed keeps the hover fill and sinks under the pressed inset. Arrow variant nudges its drawn arrow 2 px right on hover.

### Chips

- **Style:** pill, 1 px line stroke on card, ink text, 500 weight, 13 px (14 px for the large position chips).
- **Applied:** tint fill, signal stroke, signal text; dismissable applied-filter chips use this state.
- **Icons:** drawn SVG only (sliders, down-arrow for sort), never a text glyph.

### Ranked list row (signature)

Badge, name (15 px, 600) with age, club and league on one truncated meta line, the sorted value in Manrope 20 px with this season's numbers under it, and a save toggle. Minimum 64 px, ruled below. Promoted rows sit on amber wash with the Promoted tag after the name; the opened row is ringed inside in signal, on tint unless promoted. The whole row is the name link's hit area; the focus ring follows the row edge. Up and down arrows walk the list and open each row.

### Dossier (signature)

Identity line (initials mark, Manrope name, identity sentence with contract status, the promoted honesty bar when paid), then the score block: the number, the rank sentence ("10th of 14 left wings on the list"), a note, and the range rule (lowest and highest of the position's list on a 1 px line rule with a 12 px signal dot), then ruled facts, this season's stat strip with last season a step back under it, then the highlights plate. Opening another player cross-fades it in over 200 ms.

### Highlights plate

A 20 px rounded plate on signal-deep with the board glow, faint chalk lines and a play mark, captioned "Sample clip" in card text, 912 by 400 at lg and 16:9 below. A real clip replaces it with a native video element of the same shape.

### Popovers and sheets

Built on the platform popover API (`popover="auto"`: light dismiss, Escape and the top layer from the browser) and placed under their trigger with CSS anchor positioning, flipping when space runs out. From lg: a 14 px rounded card panel 8 px under the trigger, 360 or 480 px wide. Below lg: a full-width bottom sheet, 16 px top corners, at most 85 % of the viewport, over a 30 % ink backdrop, with a 44 px close button. Head and foot are fixed with rules; the body scrolls. Browsers without popover support show the panel in the flow, open.

### Shell

- **Top bar:** card surface, ruled below, 60 px (64 px from lg): brand, nav, the seat switch "Viewing as Club | Player" and HR | EN. Phones keep the brand, a seat pill and a menu button.
- **Switches:** a tint pill track; the current option is a card pill with a 600 weight and the switch-thumb shadow. Option order never changes; only the selection moves.
- **Sample strip:** a 13 px muted line on tint directly under the top bar on every demo screen, shortened on phones.

### Search composer

One rounded bar (14 px corners, line stroke, red stroke when invalid) with fields separated by 36 px vertical rules: each field a muted 12 px label over a 15 px value, the placeholder in signal 600. Search sits at the end of the bar on wide screens and full width under the fields on phones, where the fields stack as a ruled form.

## Do's and Don'ts

### Do:

- **Do** put the sample label on every demo screen, in words.
- **Do** word every paid placement: the Promoted tag in rows, the Promoted pill on the board, the honesty bar on the dossier.
- **Do** separate content with 1 px `line` rules and keep surfaces flat.
- **Do** give every target 44 px below lg.
- **Do** give a score its context: the rank sentence and the position's range sit beside it.
- **Do** drop animations under reduced motion in the demo, keeping colour and state changes (row settle and dossier swap are opacity only, 160 ms and 200 ms, ease `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Do** use `bg-tint` where a newly added shadcn primitive paints `bg-muted`; `muted` here is a text colour.

### Don't:

- **Don't** use amber or amber wash for anything but Promoted.
- **Don't** signal a state by colour alone.
- **Don't** box list rows, facts or stats into cards; the highlights plate and the initials mark are the only framed content objects.
- **Don't** put shadows on content in the flow.
- **Don't** use text glyphs as icons; icons are drawn SVG.
- **Don't** make anything travel in the demo; motion is opacity and colour only.
- **Don't** set display type in Plex or body text in Manrope.
