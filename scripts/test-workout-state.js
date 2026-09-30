#!/usr/bin/env node

const assert = require("node:assert/strict");
const { completedDates, removeDateEntry } = require("../js/workout-state.js");

assert.deepEqual(completedDates({ date: "2026-09-30", completed: false }), []);
assert.deepEqual(completedDates({ date: "2026-09-30" }), []);
assert.deepEqual(
  completedDates({ date: "2026-09-30", actualLogs: { "2026-09-30": [] } }),
  ["2026-09-30"],
);
assert.deepEqual(
  completedDates({
    date: "2026-09-30",
    completedDates: ["2026-09-30", "not-a-date"],
  }),
  ["2026-09-30"],
);

const entries = {
  "2026-09-30": [{ reps: "10" }],
  "2026-10-01": [{ reps: "12" }],
};
assert.deepEqual(removeDateEntry(entries, "2026-09-30"), {
  "2026-10-01": [{ reps: "12" }],
});
assert.deepEqual(entries["2026-09-30"], [{ reps: "10" }]);
assert.equal(removeDateEntry(null, "2026-09-30"), null);

console.log("Forge workout-state tests: completion and date cleanup passed");
