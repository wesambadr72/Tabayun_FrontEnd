# Tabayun Product Design System

This document captures the current product UI direction used in the frontend.

## Brand Foundation

- Brand role: smart Saudi legal tourism assistant.
- Personality: calm, official, trustworthy, approachable.
- Visual direction: Saudi heritage warmth translated into clean product UI.
- Primary palette:
- Ink: `#2C160F`
  - Coffee: `#2C160F`
  - Clay: `#2C160F`
  - Gold: `#C49A6C`
  - Sand: `#E8DDC9`
  - Paper: `#F6F1E7`
  - Pearl: `#FBF8F2`
- Semantic palette:
  - Danger: `#8E2C1D`
  - Success: `#2F6B4F`
  - Info: `#315E72`

## Layout Rules

- Mobile-first layouts use single-column content, high tap targets, and bottom-safe spacing.
- Desktop layouts use a max container of `72rem` and two-column patterns only when they improve scanability.
- Cards use 28-30px radius for premium surfaces, with restrained borders and warm shadows.
- Hero sections use real imagery or product-relevant scene imagery, not generic gradient decoration.

## Components

- `PageShell`: shared app background and direction wrapper.
- `BrandMark`: logo lockup with mark and wordmark.
- `SectionHeader`: consistent page and section headings.
- `SurfaceCard`: light/dark card surfaces.
- `StatusBadge`: semantic labels for allowed, restricted, warning, info, and neutral states.
- `PrimaryButton`: primary, secondary, and ghost CTA styles.
- `StatePanel`: empty, loading, error, success, and warning state layout.
- `SkeletonCard`: loading placeholder.

## UX States

- Empty states explain what is missing and offer a next action.
- Loading states use skeletons for lists and simple spinners for full-screen blocking.
- Error states use a red semantic tone with a recovery action where possible.
- Warning states are used for legal risk, not decoration.
- Chat output includes source display when available and a disclaimer for sensitive cases.

## Accessibility

- Interactive elements use visible focus rings via `tabayun-focus`.
- Color contrast favors dark coffee text on pearl/paper surfaces.
- RTL/LTR support uses logical spacing and direction-aware icons.
- Mobile controls keep practical tap sizes near 44px or larger.
