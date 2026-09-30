(function (root, factory) {
  const syncRules = factory();
  if (typeof module === "object" && module.exports) module.exports = syncRules;
  else root.ForgeSyncRules = syncRules;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function isVersionConflict(error) {
    return /VERSION_CONFLICT|40001/.test(
      `${error?.message ?? ""} ${error?.code ?? ""}`,
    );
  }

  function shouldRetry(error) {
    return !isVersionConflict(error);
  }

  function status({ online, ready, dirty, saving }) {
    if (saving) return "Saving to Supabase…";
    if (dirty && !online) return "Pending sync — offline";
    if (dirty && !ready) return "Pending sync — waiting for connection";
    if (dirty) return "Pending sync";
    return ready ? "Saved to Supabase" : "Saved on this device";
  }

  return { isVersionConflict, shouldRetry, status };
});
