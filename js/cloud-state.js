(function (root, factory) {
  const cloudState = factory();
  if (typeof module === "object" && module.exports) module.exports = cloudState;
  else root.ForgeCloudState = cloudState;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function readJson(storage, key, fallback) {
    try {
      const value = JSON.parse(storage.getItem(key) || "null");
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function accountSettings(settings, defaults) {
    const { menuPosition: _defaultMenuPosition, ...syncedDefaults } = defaults;
    const source =
      settings && typeof settings === "object" && !Array.isArray(settings)
        ? settings
        : {};
    const { menuPosition: _deviceMenuPosition, ...syncedSettings } = source;
    return { ...syncedDefaults, ...syncedSettings };
  }

  function snapshot({ storage, keys, defaults }) {
    return {
      schemaVersion: 1,
      workouts: readJson(storage, keys.workouts, []),
      restDays: readJson(storage, keys.restDays, []),
      profile: readJson(storage, keys.profile, {}),
      settings: accountSettings(
        readJson(storage, keys.settings, defaults),
        defaults,
      ),
      goals: readJson(storage, keys.goals, []),
      prHistory: readJson(storage, keys.prHistory, []),
      workoutTemplates: readJson(storage, keys.workoutTemplates, []),
      sectionTemplates: readJson(storage, keys.sectionTemplates, []),
      workoutDraft: readJson(storage, keys.workoutDraft, null),
      favoriteExerciseIds: readJson(storage, keys.favoriteExerciseIds, []),
      recentExerciseIds: readJson(storage, keys.recentExerciseIds, []),
    };
  }

  function writeJson(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  function apply({ storage, keys, defaults, remote }) {
    writeJson(storage, keys.workouts, Array.isArray(remote.workouts) ? remote.workouts : []);
    writeJson(storage, keys.restDays, Array.isArray(remote.restDays) ? remote.restDays : []);
    writeJson(
      storage,
      keys.profile,
      remote.profile && typeof remote.profile === "object" ? remote.profile : {},
    );
    const localSettings = readJson(storage, keys.settings, defaults);
    writeJson(storage, keys.settings, {
      ...accountSettings(remote.settings, defaults),
      menuPosition: localSettings.menuPosition ?? defaults.menuPosition,
    });
    writeJson(storage, keys.goals, Array.isArray(remote.goals) ? remote.goals : []);
    writeJson(
      storage,
      keys.prHistory,
      Array.isArray(remote.prHistory) ? remote.prHistory : [],
    );
    writeJson(
      storage,
      keys.workoutTemplates,
      Array.isArray(remote.workoutTemplates) ? remote.workoutTemplates : [],
    );
    writeJson(
      storage,
      keys.sectionTemplates,
      Array.isArray(remote.sectionTemplates) ? remote.sectionTemplates : [],
    );
    writeJson(
      storage,
      keys.favoriteExerciseIds,
      Array.isArray(remote.favoriteExerciseIds)
        ? remote.favoriteExerciseIds
        : [],
    );
    writeJson(
      storage,
      keys.recentExerciseIds,
      Array.isArray(remote.recentExerciseIds) ? remote.recentExerciseIds : [],
    );

    if (remote.workoutDraft && typeof remote.workoutDraft === "object")
      writeJson(storage, keys.workoutDraft, remote.workoutDraft);
    else storage.removeItem(keys.workoutDraft);

  }

  function hasData(state) {
    return Boolean(
      state.workouts?.length ||
        state.restDays?.length ||
        state.goals?.length ||
        state.workoutTemplates?.length ||
        state.sectionTemplates?.length ||
        state.workoutDraft ||
        state.favoriteExerciseIds?.length ||
        state.recentExerciseIds?.length ||
        (state.profile && Object.values(state.profile).some(Boolean)),
    );
  }

  function validateExport(value) {
    if (!value || typeof value !== "object" || Array.isArray(value))
      return { valid: false, reason: "Backup must be a JSON object." };
    if (Number(value.schemaVersion) !== 1)
      return { valid: false, reason: "This backup version is not supported." };
    const arrays = [
      "workouts",
      "restDays",
      "goals",
      "prHistory",
      "workoutTemplates",
      "sectionTemplates",
      "favoriteExerciseIds",
      "recentExerciseIds",
    ];
    if (arrays.some((key) => value[key] !== undefined && !Array.isArray(value[key])))
      return { valid: false, reason: "A backup list is not valid." };
    if (value.profile !== undefined && (!value.profile || typeof value.profile !== "object" || Array.isArray(value.profile)))
      return { valid: false, reason: "Backup profile data is not valid." };
    if (value.settings !== undefined && (!value.settings || typeof value.settings !== "object" || Array.isArray(value.settings)))
      return { valid: false, reason: "Backup settings are not valid." };
    if (
      value.workoutDraft !== undefined &&
      value.workoutDraft !== null &&
      (typeof value.workoutDraft !== "object" || Array.isArray(value.workoutDraft))
    )
      return { valid: false, reason: "Backup draft data is not valid." };
    return { valid: true };
  }

  return { snapshot, apply, hasData, validateExport };
});
