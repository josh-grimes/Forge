const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  // Browser tests are intentionally offline from Supabase. Authentication and
  // RLS behavior belong in a separate test-project job, never production.
  await page.route("**cdn.jsdelivr.net/**", (route) => route.abort());
  await page.route("**fonts.googleapis.com/**", (route) => route.abort());
  await page.route("**fonts.gstatic.com/**", (route) => route.abort());
});

async function openApp(page) {
  await page.goto("/index.html");
  await expect(page.locator("#auth-bootstrap")).toBeHidden({ timeout: 10_000 });
}

test("signed-out app boots without external services", async ({ page }) => {
  await openApp(page);
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator("#toast")).toBeAttached();
  await expect(page.locator("#cloud-status")).toContainText(/Supabase|sync|sign in/i);
});

test("local Forge storage survives a reload", async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => {
    window.forgeStorage.setItem(
      "forge-workouts",
      JSON.stringify([{ name: "Reload test" }]),
    );
  });
  await page.reload();
  await expect(page.locator("#auth-bootstrap")).toBeHidden({ timeout: 10_000 });
  await expect
    .poll(() => page.evaluate(() => window.forgeStorage.getItem("forge-workouts")))
    .toBe(JSON.stringify([{ name: "Reload test" }]));
});

test("mobile navigation exposes the primary destinations", async ({ page }) => {
  await openApp(page);
  test.skip((await page.evaluate(() => window.innerWidth)) > 700, "mobile navigation check");
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await expect(page.locator("#mobile-nav .mobile-nav-item")).toHaveCount(5);
  await expect(page.locator("#mobile-more-toggle")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
});

test("quick logging starts the workout attached to its button", async ({ page }) => {
  await openApp(page);
  const today = await page.evaluate(() => new Date().toISOString().slice(0, 10));
  await page.evaluate((date) => {
    window.forgeStorage.setItem(
      "forge-workouts",
      JSON.stringify([
        {
          id: "workout-mobile-quick-log",
          name: "Mobile Push Day",
          date,
          scheduledDates: [date],
          completedDates: [],
          sections: [{ id: "main", name: "Main Workout", format: "sets", rounds: 3 }],
          exercises: [{ name: "Bench Press", sectionId: "main", sets: "3", reps: "8", weight: "100" }],
        },
      ]),
    );
  }, today);
  await page.reload();
  await expect(page.locator("#auth-bootstrap")).toBeHidden({ timeout: 10_000 });
  const start = page.locator(".today-start");
  await expect(start).toHaveAttribute("data-workout-id", "workout-mobile-quick-log");
  await start.click();
  await expect(page.locator("#overview-title")).toHaveText("Mobile Push Day");
});

test("desktop navigation exposes the sidebar", async ({ page }) => {
  await openApp(page);
  test.skip((await page.evaluate(() => window.innerWidth)) <= 700, "desktop navigation check");
  await expect(page.locator("#primary-nav")).toBeVisible();
  await expect(page.locator("#toggle-menu")).toBeAttached();
  await expect(page.locator("#close-menu")).toBeAttached();
});
