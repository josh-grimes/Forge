#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");
const cssPath = path.join(root, "ui-components.css");
const html = fs.readFileSync(htmlPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const failures = [];
const checks = [];

function check(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
  if (!passed) failures.push(`${name}${detail ? `: ${detail}` : ""}`);
}

function inlineScripts(source) {
  return [...source.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
}

check("skip link", /class=["']skip-link["'][^>]*href=["']#main-content["']/.test(html));
check("main landmark target", /<main\b[^>]*id=["']main-content["']/.test(html));
check("primary navigation landmark", /<nav\b[^>]*class=["'][^"']*primary-nav/.test(html));
check("minimal header", /<header\b[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>\s*<button\b[^>]*id=["']toggle-menu["'][\s\S]*?<\/button>\s*<\/header>/.test(html));
check("sidebar profile and settings", /id=["']open-profile["']/.test(html) && /id=["']open-settings["']/.test(html) && /class=["'][^"']*sidebar-settings/.test(html));
check("five primary destinations", (html.match(/data-primary-route=/g) || []).length === 5);
check("settings sections", ["Appearance", "Units &amp; Measurements", "Workout Preferences", "Account", "Data &amp; Privacy"].every((label) => html.includes(label)));
check("theme choices", ["light", "dark", "system"].every((value) => new RegExp(`name=["']theme["'][^>]*value=["']${value}["']`).test(html)));
check("theme-driven interaction colors", /--primary:\s*var\(--color-accent\)/.test(html) && /accent-color:\s*var\(--color-accent\)/.test(html));
check("achievement color remains semantic", /--color-pr:\s*#fbbf24/.test(html) && /var\(--color-pr(?:-text|-background|-background-strong|-border)?\)/.test(html));
check("theme-aware brand assets", /id=["']forge-logo["']/.test(html) && /forge-logo-blue\.png/.test(html) && /id=["']forge-favicon["']/.test(html) && /forge-icon-blue\.png/.test(html));
check("Forge Workout naming", /id=["']new-workout-heading["']>Forge Workout</.test(html) && !/>New Workout</.test(html));
check("builder surfaces use theme tokens", /workout-commit-actions[^\{]*\{[^}]*background:\s*var\(--color-surface-overlay\)/.test(html) && /builder-review-exercise[^\{]*\{[^}]*var\(--color-divider-subtle\)/.test(html));
check("desktop sidebar has internal close control", /id=["']close-menu["'][^>]*aria-controls=["']primary-nav["']/.test(html));
check("menu position setting", /name=["']menu-position["'][^>]*value=["']left["']/.test(html) && /name=["']menu-position["'][^>]*value=["']right["']/.test(html));
check("persisted menu position", /menuPosition:\s*["']left["']/.test(html) && /dataset\.menuPosition/.test(html));
check("five-item mobile navigation", /id=["']mobile-nav["']/.test(html) && (html.match(/class=["']mobile-nav-item/g) || []).length === 5);
check("mobile More destinations", ["library", "profile", "settings"].every((route) => new RegExp(`data-mobile-more-route=["']${route}["']`).test(html)));
check("mobile Forge action", /class=["'][^"']*mobile-nav-forge[^"']*["'][^>]*data-mobile-route=["']forge["']/.test(html));
check("profile excludes training goals", !/profile-fitnessGoal|profile-experienceLevel|profile-goal[123]/.test(html));
check("persisted settings", /const SETTINGS_KEY = ["']forge-settings["']/.test(html) && /localStorage\.setItem\(SETTINGS_KEY/.test(html));
check("library tab controls", /id=["']library-templates-tab["'][^>]*aria-controls=["']library-templates-panel["']/.test(html) && /id=["']library-exercises-tab["'][^>]*aria-controls=["']library-exercises-panel["']/.test(html));
check("library tab selection state", /id=["']library-templates-tab["'][^>]*aria-selected=["']true["'][^>]*tabindex=["']0["']/.test(html) && /id=["']library-exercises-tab["'][^>]*aria-selected=["']false["'][^>]*tabindex=["']-1["']/.test(html));
check("reduced motion styles", /prefers-reduced-motion:\s*reduce/.test(css));
check("forced colors styles", /forced-colors:\s*active/.test(css));
check("overflow protection", /html,\s*\nbody\s*\{[\s\S]*?overflow-x:\s*hidden/.test(css));

const scripts = inlineScripts(html);
scripts.forEach((source, index) => {
  try {
    new Function(source);
    check(`inline script ${index + 1} syntax`, true);
  } catch (error) {
    check(`inline script ${index + 1} syntax`, false, error.message);
  }
});

const images = [...html.matchAll(/<img\b([^>]*)>/gi)];
const missingAlt = images.filter(([, attributes]) => !/\balt\s*=/.test(attributes));
check("image alternatives", missingAlt.length === 0, missingAlt.length ? `${missingAlt.length} image(s) missing alt text` : "");

console.log(`Forge UI audit: ${checks.filter((item) => item.passed).length}/${checks.length} checks passed`);
checks.filter((item) => !item.passed).forEach((item) => console.error(`FAIL: ${item.name}${item.detail ? ` — ${item.detail}` : ""}`));
if (failures.length) process.exitCode = 1;
