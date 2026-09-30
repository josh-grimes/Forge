# Forge account data boundaries

Forge supports separate personal accounts and multiple devices per account. It
does not support workout sharing, teams, invitations, or cross-account access.

## Account-owned and synchronized data

These values belong to the authenticated user and may sync between that user's
devices:

- workouts and schedules
- completed workout logs and editable results
- goals and personal records
- workout and section templates
- workout-builder drafts
- profile data and profile photo
- theme, units, rest duration, sound, and other account preferences
- exercise favorites and recents

## Device-local data

These values must stay on the device where they were created:

- active workout and timer/player state
- current screen and navigation state
- sidebar open/closed state
- sidebar/menu placement
- temporary UI state

An active workout is intentionally not part of cloud sync. Syncing it would let
one device overwrite another device's timer or player position. The completed
result is account-owned once the workout is saved.

## Anonymous data

Signed-out data belongs to an anonymous browser namespace. It must not be
silently shown to, uploaded to, or merged into an authenticated account. Any
future upload of anonymous data must be an explicit user action.

## Account switching

When a user signs out, active account data is cleared from the browser's active
namespace. Signing into another account must load only that account's local and
cloud data. Row-level security remains the server-side isolation boundary.

## Future authentication direction

Magic-link authentication remains the current implementation. Username/password
authentication can be added later, with email retained for account recovery.
