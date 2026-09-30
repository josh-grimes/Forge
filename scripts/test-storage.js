#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const values = new Map([["unrelated-key", "preserve me"]]);
const localStorage = {
  get length() {
    return values.size;
  },
  key(index) {
    return [...values.keys()][index] ?? null;
  },
  getItem(key) {
    return values.has(key) ? values.get(key) : null;
  },
  setItem(key, value) {
    values.set(String(key), String(value));
  },
  removeItem(key) {
    values.delete(String(key));
  },
};
const context = { window: { localStorage } };
vm.runInNewContext(
  fs.readFileSync(require("node:path").join(__dirname, "../js/forge-storage.js"), "utf8"),
  context,
);

const storage = context.window.forgeStorage;
assert.equal(storage.persistent, true);
storage.setItem("forge-workouts", '[{"name":"Push day"}]');
assert.equal(storage.getItem("forge-workouts"), '[{"name":"Push day"}]');
storage.clear();
assert.equal(storage.getItem("forge-workouts"), null);
assert.equal(values.get("unrelated-key"), "preserve me");

(async () => {
  await storage.setNamespace("user:user-a");
  storage.setItem("forge-workouts", '[{"name":"A"}]');
  await storage.setNamespace("user:user-b");
  assert.equal(storage.getItem("forge-workouts"), null);
  await storage.setNamespace("user:user-a");
  assert.equal(storage.getItem("forge-workouts"), '[{"name":"A"}]');
  console.log("Forge storage tests: persistence, namespaces, and scoped clearing passed");
})();
