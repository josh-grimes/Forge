# Forge multi-device sync behavior

- Account-owned changes are saved optimistically and marked `Pending sync` when
  the network is unavailable.
- Pending changes retry automatically when the browser reports that it is
  online again.
- If another device saved first, Forge offers a simple choice: load the newer
  cloud copy or keep this device's copy.
- Before loading the cloud copy, Forge stores a local sync backup in the active
  account namespace.
- Active workout/timer state remains device-local and is never uploaded.

Integration coverage verifies that an authenticated user can read only their
own identity row, save the first cloud state, and receives a version conflict
when attempting to overwrite a newer version with a stale version number.
