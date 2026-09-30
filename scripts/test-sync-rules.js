#!/usr/bin/env node

const assert = require("node:assert/strict");
const { isVersionConflict, shouldRetry, status } = require("../js/sync-rules.js");

assert.equal(isVersionConflict({ code: "40001" }), true);
assert.equal(isVersionConflict({ message: "VERSION_CONFLICT" }), true);
assert.equal(shouldRetry({ code: "NETWORK_ERROR" }), true);
assert.equal(shouldRetry({ code: "40001" }), false);
assert.equal(status({ online: false, ready: true, dirty: true, saving: false }), "Pending sync — offline");
assert.equal(status({ online: true, ready: false, dirty: true, saving: false }), "Pending sync — waiting for connection");
assert.equal(status({ online: true, ready: true, dirty: false, saving: false }), "Saved to Supabase");

console.log("Forge sync-rule tests: retry, conflict, and status behavior passed");
