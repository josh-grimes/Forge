const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.route("**cdn.jsdelivr.net/**", (route) => route.abort());
  await page.route("**fonts.googleapis.com/**", (route) => route.abort());
  await page.route("**fonts.gstatic.com/**", (route) => route.abort());
  await page.goto("/index.html");
  await expect(page.locator("#auth-bootstrap")).toBeHidden({ timeout: 10_000 });
});

test("visible controls have accessible names and no horizontal overflow", async ({ page }) => {
  const audit = await page.evaluate(() => {
    const controls = [...document.querySelectorAll("button, a, input, select, textarea")];
    const unnamed = controls.filter((control) => {
      if (control.hidden || control.offsetParent === null) return false;
      const label = control.getAttribute("aria-label") ||
        control.getAttribute("title") ||
        control.labels?.[0]?.textContent ||
        control.textContent;
      return !String(label || "").trim();
    });
    return {
      unnamed: unnamed.map((control) => control.outerHTML.slice(0, 180)),
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
  expect(audit.unnamed).toEqual([]);
  expect(audit.scrollWidth).toBeLessThanOrEqual(audit.viewport);
});
