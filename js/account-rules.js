(function (root, factory) {
  const accountRules = factory();
  if (typeof module === "object" && module.exports) module.exports = accountRules;
  else root.ForgeAccountRules = accountRules;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9_-]{1,22}[a-z0-9])?$/;

  function normalizeUsername(value) {
    return String(value ?? "").trim().toLowerCase();
  }

  function isValidUsername(value) {
    const username = normalizeUsername(value);
    return username.length >= 3 && username.length <= 24 && USERNAME_PATTERN.test(username);
  }

  return { normalizeUsername, isValidUsername };
});
