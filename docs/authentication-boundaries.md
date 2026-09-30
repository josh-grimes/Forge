# Forge authentication boundaries

Forge currently uses Supabase magic-link authentication. The account boundary
is the authenticated Supabase user ID, not the display name or email text.

The account identity foundation now supports:

- unique username usable for login
- email required for password recovery
- username normalization and client-side validation
- a Supabase-owned identity row with a unique username constraint
- separate personal accounts only
- no shared workouts or team permissions

The app must resolve authentication and the corresponding storage namespace
before displaying account data. During that bootstrap period, application
surfaces are hidden behind the account-loading status screen. The email
magic-link flow remains available. Username/password sign-in, account creation,
and recovery use the `forge-auth` server-side function, which resolves the
username without exposing another user's recovery email. The client must never
query all usernames or store a password in Forge state.

Anonymous data remains in the anonymous namespace. Signing in does not silently
merge or upload it. Signing out clears the active account namespace, switches
back to the anonymous namespace, and rerenders only after that switch completes.
