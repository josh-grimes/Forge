#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const tests = [
  "test-navigation.js",
  "test-theme.js",
  "test-builder-theme.js",
  "test-desktop-menu.js",
  "test-mobile-navigation.js",
  "test-storage.js",
  "test-workout-state.js",
  "test-workout-rules.js",
  "test-mobile-quick-log.js",
  "test-account-rules.js",
  "test-sync-rules.js",
  "test-cloud-state.js",
  "audit-ui.js",
];

let failed = false;
for (const test of tests) {
  const result = spawnSync(process.execPath, [path.join(__dirname, test)], {
    stdio: "inherit",
  });
  if (result.status !== 0) failed = true;
}
if (failed) process.exitCode = 1;
else console.log(`Forge test suite: ${tests.length}/${tests.length} checks passed`);
