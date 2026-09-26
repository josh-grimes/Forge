# Forge UI Regression Checklist

Use this checklist before and after UI-system changes. Record failures with the screen, viewport, browser, and exact recovery steps.

## Test setup

- [ ] Start from a clean browser profile or record the existing local data state.
- [ ] Test signed out.
- [ ] Test with Supabase unavailable or temporarily offline.
- [ ] Test signed in when cloud sync is configured.
- [ ] Test at 320, 390, 430, 768, 1024, 1280, 1440, and 1920 px.
- [ ] Test browser Back and Forward where navigation changes the visible workflow.
- [ ] Test refresh during a draft and during an active workout.

## Home and navigation

- [ ] Home loads without console-blocking errors.
- [ ] Today's workout state is correct for no workout, planned workout, completed workout, and rest day.
- [ ] Calendar opens and returns without losing relevant state.
- [ ] Progress opens and returns without losing relevant state.
- [ ] Goals open and return without losing relevant state.
- [ ] Profile opens and saves correctly.
- [ ] Templates open, load, and return correctly.
- [ ] The primary Forge Workout action is obvious and usable.
- [ ] No screen creates horizontal scrolling at the tested widths.

## Workout builder

- [ ] A blank workout can be started.
- [ ] An existing draft can be resumed.
- [ ] A template can be loaded without silently losing a current draft.
- [ ] Details, Build, and Review stages preserve entered values.
- [ ] Sections can be added, renamed, reordered, and removed.
- [ ] Sets and rounds remain distinct.
- [ ] Exercises can be selected from the library.
- [ ] Recent and favorite exercises work.
- [ ] A custom exercise can be created.
- [ ] Parameter chips show the correct values and units.
- [ ] Parameters can be added, edited, and removed.
- [ ] Previous performance can be carried forward and corrected.
- [ ] Invalid input identifies the problem and explains recovery.
- [ ] Valid unusual workouts are not blocked by unnecessary validation.
- [ ] Draft autosave status is understandable.
- [ ] Review catches incomplete choices without discarding valid work.
- [ ] Saving and starting a workout preserve the final prescription.

## Active Workout

- [ ] The current exercise and current set or interval are immediately obvious.
- [ ] Target and actual performance are visually distinct.
- [ ] Known values are pre-filled.
- [ ] The primary set-completion action is easy to reach with one hand.
- [ ] Repeated taps do not double-submit a set.
- [ ] Completing a set updates progress immediately.
- [ ] Rest starts, stops, resets, and reaches zero correctly.
- [ ] The next exercise or set is visible without competing with the current task.
- [ ] Timer state remains understandable with audio off.
- [ ] Workout state survives an overlay, navigation, refresh, and temporary connection loss.
- [ ] Accidental input can be corrected quickly.
- [ ] Finishing a workout produces a clear recap and preserves all entries.
- [ ] Personal-record and completion feedback does not block the next action.

## Calendar, history, progress, and goals

- [ ] Workouts can be scheduled, moved, edited, and removed.
- [ ] Rest days and streaks update correctly.
- [ ] Saved workout compact and detailed views remain usable.
- [ ] Progress charts match the underlying workout data.
- [ ] Chart summaries and data tables remain available without visual interpretation.
- [ ] Goals can be created, edited, achieved, archived, and recovered from accidental changes.
- [ ] Personal records and reports update after workout completion.
- [ ] Empty states explain what to do next.

## Data safety and sync

- [ ] Signed-out data remains available locally.
- [ ] Offline workout logging continues locally.
- [ ] Local changes retry after connectivity returns.
- [ ] Sign-in does not silently overwrite existing local data.
- [ ] A newer cloud version produces an understandable conflict path.
- [ ] Export includes the expected user data.
- [ ] Refresh does not lose drafts or active workout entries.

## Accessibility and usability

- [ ] Every core action is keyboard reachable.
- [ ] Focus is visible and follows a logical order.
- [ ] Dialogs, sheets, and panels contain and restore focus correctly.
- [ ] Icon-only controls have accessible names.
- [ ] Status, error, and completion messages are announced appropriately.
- [ ] Important states remain understandable without color.
- [ ] Important cues remain understandable with reduced motion.
- [ ] Important cues remain understandable with audio and haptics disabled.
- [ ] Text scaling and browser zoom do not clip or remove functionality.
- [ ] Interactive targets are at least 44 × 44 px with adequate separation.
- [ ] Left- and right-handed use remains practical on mobile.
- [ ] Bright-room and dim-room viewing remain legible.

## Result

- Revision tested: ____________________
- Date: ____________________
- Tester: ____________________
- Browsers/devices: ____________________
- Blocking failures: ____________________
- Follow-up issues: ____________________

