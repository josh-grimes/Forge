#!/usr/bin/env node

const assert = require("node:assert/strict");
const {
  normalizeUsername,
  isValidUsername,
} = require("../js/account-rules.js");

assert.equal(normalizeUsername("  Forge_User  "), "forge_user");
assert.equal(isValidUsername("forge_user"), true);
assert.equal(isValidUsername("ab"), false);
assert.equal(isValidUsername("bad name"), false);
assert.equal(isValidUsername("-starts-wrong"), false);
assert.equal(isValidUsername("ends-wrong-"), false);
assert.equal(isValidUsername("a".repeat(25)), false);

console.log("Forge account-rule tests: username normalization and validation passed");
