# AGENTS.md — JuiceVibe

## Design system (apps/admin)
- Primary brand color is emerald — never leave shadcn/ui default slate/zinc unthemed.
- Ink/dark tones anchor to #0F2A1E / #1F2E24 (shared with apps/web brand).
- All numerals (prices, totals, stock counts, dates, IDs) use IBM Plex Mono.
- Display headings use Bricolage Grotesque or Space Grotesk, used sparingly.
- No halftone textures or stamp-badge motifs in admin — those are storefront-only.
- Avoid generic AI-dashboard defaults: no purple/blue gradients, no glassmorphism,
  no decorative numbered markers, no unearned KPI sparkline cards.

## Architecture
- Orders list view and Kanban board must read from one shared state source.
- No static/mock data may exist in apps/web/src/data — all data through packages/services.
- Role-based access (admin/manager/cashier/kitchen/editor) enforced in apps/api guards,
  not only hidden in the UI.