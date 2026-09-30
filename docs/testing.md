# Forge testing

## Local commands

Run the dependency install once:

```sh
npm install
npx playwright install chromium
```

Then run the full suite:

```sh
npm test
```

The unit suite is dependency-light and runs with `npm run test:unit`. Browser
tests use a local static server and intentionally abort Supabase and font CDN
requests, so normal CI never touches production data.

## Test boundaries

- Unit tests cover pure state, storage, cloud serialization, navigation, and UI
  source audits.
- Playwright covers signed-out startup, reload persistence, and desktop/mobile
  navigation.
- RLS and authenticated sync tests must use a separate Supabase test project.
- The manual `Forge Supabase auth integration` workflow runs only when the
  `FORGE_SUPABASE_TEST_ENABLED` repository variable is `true`. It uses the
  `FORGE_TEST_*` secrets, creates a disposable test user, verifies sign-up,
  username sign-in, and duplicate-username rejection, then deletes the user.
  Production credentials must never be placed in CI.
- Multi-device sync must verify pending status, automatic retry after an online
  event, simple conflict choices, and a local backup before cloud replacement.
