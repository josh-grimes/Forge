document.documentElement.dataset.accountBootstrap = "true";
try {
  const savedSettings = JSON.parse(
    window.forgeStorage?.getItem("forge-settings") || "{}",
  );
  if (savedSettings.theme === "light" || savedSettings.theme === "dark")
    document.documentElement.dataset.theme = savedSettings.theme;
  if (savedSettings.menuPosition === "right")
    document.documentElement.dataset.menuPosition = "right";
} catch (_) {}
