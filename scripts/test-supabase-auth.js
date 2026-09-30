#!/usr/bin/env node

const assert = require("node:assert/strict");
const { createClient } = require("@supabase/supabase-js");

const required = [
  "FORGE_TEST_SUPABASE_URL",
  "FORGE_TEST_SUPABASE_ANON_KEY",
  "FORGE_TEST_SUPABASE_SERVICE_ROLE_KEY",
  "FORGE_TEST_USERNAME",
  "FORGE_TEST_EMAIL",
  "FORGE_TEST_PASSWORD",
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.log(`Forge Supabase auth integration: skipped; missing ${missing.join(", ")}`);
  process.exit(0);
}

const url = process.env.FORGE_TEST_SUPABASE_URL;
const anon = createClient(url, process.env.FORGE_TEST_SUPABASE_ANON_KEY);
const admin = createClient(url, process.env.FORGE_TEST_SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const username = process.env.FORGE_TEST_USERNAME.toLowerCase();
const email = process.env.FORGE_TEST_EMAIL.toLowerCase();
const password = process.env.FORGE_TEST_PASSWORD;
const functionUrl = `${url}/functions/v1/forge-auth`;
let userId = null;

async function callAuth(body) {
  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      apikey: process.env.FORGE_TEST_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

async function main() {
  const created = await callAuth({ action: "sign_up", username, email, password });
  assert.equal(created.status, 200);
  assert.equal(created.body.requiresEmailConfirmation, true);

  const { data: found, error: findError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  assert.equal(findError, null);
  userId = found.users.find((user) => user.email === email)?.id;
  assert.ok(userId, "test user was not created");
  const { error: confirmError } = await admin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
  assert.equal(confirmError, null);

  const signedIn = await callAuth({ action: "sign_in", username, password });
  assert.equal(signedIn.status, 200);
  assert.ok(signedIn.body.session?.access_token);

  await anon.auth.setSession(signedIn.body.session);
  const { data: ownProfile, error: ownProfileError } = await anon
    .from("forge_user_profiles")
    .select("username,recovery_email")
    .eq("user_id", userId);
  assert.equal(ownProfileError, null);
  assert.deepEqual(ownProfile, [{ username, recovery_email: email }]);

  const { data: savedVersion, error: saveError } = await anon.rpc("save_forge_state", {
    expected_version: 0,
    new_data: { schemaVersion: 1, profile: { username } },
  });
  assert.equal(saveError, null);
  assert.equal(Number(savedVersion), 1);
  const { error: conflictError } = await anon.rpc("save_forge_state", {
    expected_version: 0,
    new_data: { schemaVersion: 1, profile: { username, changed: true } },
  });
  assert.equal(conflictError?.code, "40001");

  const duplicate = await callAuth({
    action: "sign_up",
    username,
    email: `duplicate-${Date.now()}@example.test`,
    password,
  });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.error, "USERNAME_TAKEN");

  console.log("Forge Supabase auth integration: sign-up, sign-in, and uniqueness passed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (userId) await admin.auth.admin.deleteUser(userId);
  });
