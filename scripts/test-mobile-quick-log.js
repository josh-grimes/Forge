#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");

const app = fs.readFileSync("js/app.js", "utf8");
assert.match(app, /function attachWorkoutStartButton_\(button, workout, getDate\)/);
assert.match(app, /button\.dataset\.workoutId = workout\.id/);
assert.equal(
  (app.match(/attachWorkoutStartButton_\(start, workout/g) || []).length,
  2,
);
assert.match(app, /attachWorkoutStartButton_\(track, workout, \(\) => dateInput\.value\)/);
assert.match(app, /attachWorkoutStartButton_\(play, workout, \(\) => date\)/);
assert.match(app, /startSavedWorkout\(button\.dataset\.workoutId, getDate\(\)\)/);

console.log("Forge mobile quick-log tests: start buttons keep their workout identity");
