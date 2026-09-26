(function (root, factory) {
  const navigation = factory();
  if (typeof module === "object" && module.exports) module.exports = navigation;
  else root.ForgeNavigation = navigation;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const views = new Set([
    "home",
    "forge",
    "builder",
    "library",
    "calendar",
    "progress",
    "goals",
    "profile",
    "settings",
    "weight",
  ]);

  function createNavigationState(requestedView) {
    const activeMainView = views.has(requestedView) ? requestedView : "home";
    return {
      activeMainView,
      editorOpen: activeMainView === "builder",
      workoutStartOpen: activeMainView === "forge",
      templatesOpen: activeMainView === "library",
      calendarOpen: activeMainView === "calendar",
      progressOpen: activeMainView === "progress",
      goalsOpen: activeMainView === "goals",
      profileOpen: activeMainView === "profile",
      settingsOpen: activeMainView === "settings",
      weightOpen: activeMainView === "weight",
    };
  }

  function primaryRouteForView(view) {
    if (view === "forge" || view === "builder") return "forge";
    if (view === "goals" || view === "weight") return "progress";
    return ["home", "library", "calendar", "progress", "profile", "settings"].includes(view) ? view : "home";
  }

  return { createNavigationState, primaryRouteForView };
});
