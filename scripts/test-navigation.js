#!/usr/bin/env node

const assert = require("node:assert/strict");
const { createNavigationState, primaryRouteForView } = require("../navigation-state.js");

const viewFlags = [
  "editorOpen",
  "workoutStartOpen",
  "templatesOpen",
  "calendarOpen",
  "progressOpen",
  "goalsOpen",
  "profileOpen",
  "settingsOpen",
  "weightOpen",
];

function assertView(view, route, visibleFlag = null) {
  const state = createNavigationState(view);
  assert.equal(state.activeMainView, view);
  assert.equal(primaryRouteForView(state.activeMainView), route);
  assert.deepEqual(viewFlags.filter((flag) => state[flag]), visibleFlag ? [visibleFlag] : []);
}

assertView("home", "home");
assertView("forge", "forge", "workoutStartOpen");
assertView("builder", "forge", "editorOpen");
assertView("calendar", "calendar", "calendarOpen");
assertView("progress", "progress", "progressOpen");
assertView("library", "library", "templatesOpen");
assertView("profile", "profile", "profileOpen");
assertView("settings", "settings", "settingsOpen");
assertView("goals", "progress", "goalsOpen");
assertView("weight", "progress", "weightOpen");

const primaryDestinations = ["home", "forge", "calendar", "progress", "library"];
for (const from of primaryDestinations) {
  let state = createNavigationState(from);
  for (const to of [...primaryDestinations, "profile"]) {
    state = createNavigationState(to);
    assert.equal(state.activeMainView, to, `${from} → ${to} should select the destination`);
    assert.ok(viewFlags.filter((flag) => state[flag]).length <= 1, `${from} → ${to} should leave at most one screen active`);
  }
}

const workoutToProfile = createNavigationState("profile");
assert.equal(workoutToProfile.workoutStartOpen, false);
assert.equal(workoutToProfile.editorOpen, false);
assert.equal(workoutToProfile.profileOpen, true);

const calendarToProgress = createNavigationState("progress");
assert.equal(calendarToProgress.calendarOpen, false);
assert.equal(calendarToProgress.progressOpen, true);
assert.equal(primaryRouteForView(calendarToProgress.activeMainView), "progress");

assert.equal(createNavigationState("unknown").activeMainView, "home");
console.log("Forge navigation tests: all destinations and reported regressions passed");
