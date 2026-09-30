#!/usr/bin/env node

const assert = require("node:assert/strict");
const {
  dateString,
  scheduledDates,
  matchesWeeklyRule,
  scheduledOn,
} = require("../js/workout-rules.js");

assert.equal(dateString(2026, 0, 5), "2026-01-05");
assert.deepEqual(scheduledDates({ date: "2026-09-30" }), ["2026-09-30"]);
assert.deepEqual(
  scheduledDates({ date: "2026-09-30", scheduledDates: ["2026-10-01"] }),
  ["2026-10-01"],
);

const weekly = {
  date: "2026-09-30",
  scheduledDates: [],
  recurrence: {
    weekdays: [3],
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    exceptions: [],
  },
};
assert.equal(matchesWeeklyRule(weekly, "2026-09-30"), true);
assert.equal(scheduledOn(weekly, "2026-09-30"), true);
assert.equal(
  scheduledOn(
    { ...weekly, recurrence: { ...weekly.recurrence, exceptions: ["2026-09-30"] } },
    "2026-09-30",
  ),
  false,
);

console.log("Forge workout-rules tests: scheduling and recurrence passed");
