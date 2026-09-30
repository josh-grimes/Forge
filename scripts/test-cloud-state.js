#!/usr/bin/env node

const assert = require("node:assert/strict");
const { snapshot, apply, hasData, validateExport } = require("../js/cloud-state.js");

const values = new Map([
  ["workouts", '[{"name":"Leg day"}]'],
  ["settings", '{"theme":"dark"}'],
  ["workout-draft", '{"name":"Draft"}'],
]);
const changes = [];
const storage = {
  getItem(key) {
    return values.get(key) ?? null;
  },
  setItem(key, value) {
    values.set(key, value);
    changes.push(key);
  },
  removeItem(key) {
    values.delete(key);
    changes.push(key);
  },
};
const keys = {
  workouts: "workouts",
  restDays: "rest-days",
  profile: "profile",
  settings: "settings",
  goals: "goals",
  prHistory: "pr-history",
  workoutTemplates: "workout-templates",
  sectionTemplates: "section-templates",
  workoutDraft: "workout-draft",
  favoriteExerciseIds: "favorites",
  recentExerciseIds: "recents",
};

const state = snapshot({ storage, keys, defaults: { theme: "system" } });
assert.deepEqual(state.workouts, [{ name: "Leg day" }]);
assert.deepEqual(state.settings, { theme: "dark" });
assert.equal(hasData(state), true);

apply({
  storage,
  keys,
  defaults: { theme: "system" },
  remote: { workouts: [], settings: { theme: "light" } },
});
assert.deepEqual(JSON.parse(values.get("workouts")), []);
assert.deepEqual(JSON.parse(values.get("settings")), { theme: "light" });
assert.equal(values.has("workout-draft"), false);
assert.equal(state.activeSession, undefined);
assert.equal(validateExport({ schemaVersion: 1, workouts: [] }).valid, true);
assert.equal(validateExport({ schemaVersion: 2, workouts: [] }).valid, false);
assert.equal(validateExport({ schemaVersion: 1, workouts: {} }).valid, false);

console.log("Forge cloud-state tests: snapshot, apply, and data detection passed");
