# Phase 9 — Release validation

Phase 9 establishes a repeatable release-readiness check for the UI Guide implementation.

## Automated audit

From the `forge/` directory, run:

```sh
node scripts/audit-ui.js
```

The audit checks:

- Skip navigation and the main landmark
- Primary navigation structure
- Library tab and panel relationships
- Initial tab keyboard state
- Reduced-motion and forced-colors styles
- Horizontal overflow protection
- Inline JavaScript syntax
- Image alternative text

## Current result

- Date: 2026-09-25
- Result: 11/11 checks passed
- Fonts: Goldman body, Aldrich display
- Primary responsive review widths: 320, 390, 430, 768, 1024, 1280, 1440, and 1920 px
- Manual follow-up: verify touch, screen reader, browser zoom, and both color themes in a browser session before deployment

This audit is intentionally dependency-free so it can run against the static GitHub Pages entry point without a build step.
