# Forge Workout Tracker

Forge is a static web app backed by Supabase. Google Apps Script and Google Sheets are not used.

## Repository layout

```text
Forge/
├── index.html                         # Current Forge app
├── supabase-config.js                 # Browser-safe Supabase connection values
├── supabase/
│   └── migrations/                    # Database schema and RLS policies
└── local/
    ├── forge-logo.png
    ├── forge-icon.png
    └── ...                            # Previous local-only build and source assets
```

## Supabase setup

1. Apply `supabase/migrations/202609250001_create_forge_user_state.sql` to the connected Supabase project. The Supabase GitHub integration can apply it through its normal migration workflow, or it can be pasted into the Supabase SQL editor once.
2. In Supabase, keep the Email authentication provider enabled.
3. Add `https://josh-grimes.github.io/Forge/` to **Authentication → URL Configuration → Redirect URLs**. Magic-link sign-in returns users to this URL.
4. Open `supabase-config.js` and replace the two placeholders with the project's URL and publishable key from **Project Settings → API**.
5. Merge the pull request. The included GitHub Actions workflow deploys the repository root to `https://josh-grimes.github.io/Forge/`, with `index.html` as the app entry point.

The publishable key is intended for browser use. User data is protected by the Row Level Security policies in the migration; never put a Supabase service-role key in this repository.

## Data behavior

- Forge remains usable from browser storage while signed out or temporarily offline.
- Selecting the sync status in Settings sends an email magic link for sign-in.
- The first sign-in uploads existing browser data when the account has no cloud state.
- Workouts, schedules, results, profile and weight data, goals, personal records, templates, drafts, favorites, and recents are included in cloud sync and exports.
- Saves use optimistic version checks so one device cannot silently overwrite a newer save from another device.

## Included features

- Workout planning, scheduling, repeats, and calendar tracking
- Sets and rounds workout sections
- Guided workout builder, drafts, and templates
- Exercise library and custom exercises
- Timers, per-set results, notes, and completed sessions
- Goals, personal records, progress charts, weight tracking, and streaks
- Local JSON backup/export and authenticated Supabase synchronization
- Responsive sidebar navigation, light/dark/system themes, and persisted measurement preferences
