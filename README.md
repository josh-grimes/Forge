# Forge Workout Tracker

Forge is a static web app backed by Supabase. Google Apps Script and Google Sheets are not used.

## Repository layout

```text
Forge/
├── index.html                         # App markup and entry point
├── css/
│   ├── styles.css                     # Main Forge styles and theme tokens
│   └── ui-components.css              # Shared UI component styles
├── js/
│   ├── bootstrap.js                   # Early theme/menu preference bootstrap
│   ├── exercises.js                   # Exercise library
│   ├── forge-storage.js                # Session adapter; Supabase is persistent storage
│   ├── app.js                         # Main Forge application logic
│   ├── navigation-state.js            # Navigation state helpers
│   └── supabase-config.js             # Browser-safe Supabase connection values
├── assets/
│   ├── logos/                         # Dark and light Forge logos
│   ├── icons/                         # Dark and light Forge icons
│   └── reference/                     # Preserved design reference assets
├── supabase/
│   └── migrations/                    # Database schema and RLS policies
└── scripts/                           # Validation and regression checks
```

## Supabase setup

1. Apply `supabase/migrations/202609250001_create_forge_user_state.sql` to the connected Supabase project. The Supabase GitHub integration can apply it through its normal migration workflow, or it can be pasted into the Supabase SQL editor once.
2. Apply the username identity migration after the state migration: `supabase/migrations/202609300001_create_forge_user_profiles.sql`.
3. Deploy `supabase/functions/forge-auth/index.ts` as the `forge-auth` Edge Function. Its environment must include the standard `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` values; keep the service-role key server-side only.
4. In Supabase, keep the Email authentication provider enabled.
5. Add `https://josh-grimes.github.io/Forge/` to **Authentication → URL Configuration → Redirect URLs**. Magic-link sign-in and password recovery return users to this URL.
6. Open `js/supabase-config.js` and replace the two placeholders with the project's URL and publishable key from **Project Settings → API**.
7. Merge the pull request. The included GitHub Actions workflow deploys the repository root to `https://josh-grimes.github.io/Forge/`, with `index.html` as the app entry point.

The publishable key is intended for browser use. User data is protected by the Row Level Security policies in the migration; never put a Supabase service-role key in this repository.

## Data behavior

- Forge persists local data in browser storage while signed out or offline; Supabase provides optional authenticated synchronization.
- Drafts and active workouts are persisted locally and included in authenticated cloud sync.
- Selecting the sync status in Settings sends an email magic link for sign-in.
- The first sign-in uploads the current session state when the account has no cloud state.
- Workouts, schedules, results, profile and weight data, goals, personal records, templates, drafts, favorites, and recents are included in cloud sync and exports.
- Saves use optimistic version checks so one device cannot silently overwrite a newer save from another device.

## Included features

- Workout planning, scheduling, repeats, and calendar tracking
- Sets and rounds workout sections
- Guided workout builder, drafts, and templates
- Exercise library and custom exercises
- Timers, per-set results, notes, and completed sessions
- Goals, personal records, progress charts, weight tracking, and streaks
- JSON backup/export and authenticated Supabase synchronization
- Responsive sidebar navigation, light/dark/system themes, and persisted measurement preferences
