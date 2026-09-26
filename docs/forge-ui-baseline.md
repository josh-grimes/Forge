# Forge UI Baseline

This document records the production UI baseline and subsequent information-architecture changes made during implementation of the Forge UI Guide.

## Navigation and preferences update

- The production header is intentionally limited to the sidebar open/close control.
- Desktop uses a persistent, stateful sidebar that shifts page content; tablet and mobile use an overlay drawer.
- The sidebar exposes Dashboard, Workouts, Calendar, Progress, and Search, with Profile at the top and Settings at the bottom.
- Profile contains identity/account details only. Goals and body-weight tracking remain available from Progress.
- Settings owns appearance, units, workout preferences, account sync, and data export.
- Forge stores workout measurements in canonical US units and converts at entry/display time, allowing unit preferences to change without rewriting history.

## Production source

- Production entry point: `/index.html`
- Deployment: GitHub Pages from the repository root
- Deployment workflow: `.github/workflows/deploy-pages.yml`
- Data schema and policies: `supabase/migrations/202609250001_create_forge_user_state.sql`
- Legacy/reference implementation: `local/`

The `local/` directory is not the production source. Changes to the UI guide should be implemented against the root application unless the production architecture is intentionally changed and documented here.

## Baseline revision

- Revision: `fc146d7`
- Revision date: 2026-09-25
- Root application checksum: `c15e1794979f38a313c589eb12905a5c56b69c0b86dcb0a995f3df338418e88f`

## Current feature surface

### Home and planning

- Today's workout summary
- Saved workout history
- Workout calendar and scheduling
- Rest days and streaks
- Workout templates
- Profile and training goals
- Body-weight tracking

### Workout creation

- Guided Details, Build, and Review stages
- Workout sections supporting sets and rounds
- Exercise library search
- Favorites and recent exercises
- Custom exercises
- Parameter chips and configurable parameters
- Previous-performance carry-forward
- Reordering and removal of exercises and sections
- Repeating workout schedules
- Draft autosave and draft continuation

### Active Workout

- Workout overview before starting
- Elapsed workout timer
- Stopwatch
- Rest timer
- Per-set performance entry
- Session notes
- Pause, finish, and workout recap behavior
- Personal-record and completion feedback

### Progress and reporting

- Exercise progress charts
- Accessible chart data tables
- Strength, volume, reps, duration, and distance metrics
- Goals and milestones
- Personal records
- Consistency and streak views
- Weekly and monthly reports
- Forge scorecard

### Persistence and synchronization

- Browser storage for signed-out and offline use
- Local export
- Supabase authentication and synchronization
- Optimistic version checks for concurrent saves
- Draft, workout, profile, goal, template, favorite, and progress synchronization

## Known baseline characteristics

These are observations to verify during the UI migration, not new requirements:

- The production app is a large single-page document with embedded CSS and JavaScript.
- The production visual system currently uses Aldrich and Goldman fonts.
- The production visual system is primarily dark mode with orange accent values.
- Primary destinations are exposed through a header menu and hidden content sections rather than the UI Guide's persistent five-item navigation model.
- Several actions still use confirmation dialogs; the UI Guide prefers Undo where an action is reversible.
- Accessibility support exists in several places, but focus management, screen-reader behavior, contrast, text scaling, and chart alternatives need systematic verification.

## Required viewport baseline

Every future UI review should include these widths:

| Width | Review focus |
| ---: | --- |
| 320 px | Minimum mobile width, wrapping, touch targets, no horizontal overflow |
| 390 px | Typical mobile workout flow and one-handed reach |
| 430 px | Large mobile layout and sticky action behavior |
| 768 px | Tablet transition and information density |
| 1024 px | Compact desktop/tablet layout |
| 1280 px | Standard desktop content region |
| 1440 px | Maximum primary content region |
| 1920 px | Wide-screen restraint and sustained reading width |

Also review browser zoom, text scaling, portrait/landscape orientation, reduced motion, and both color themes once the theme migration begins.
