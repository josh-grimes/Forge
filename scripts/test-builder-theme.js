#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function contrast(foreground, background) {
  const luminance = (hex) => {
    const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
    const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

for (const asset of ["local/forge-logo.png", "local/forge-icon.png", "local/forge-logo-blue.png", "local/forge-icon-blue.png"]) {
  const bytes = fs.readFileSync(path.join(root, asset));
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${asset} must be a valid PNG asset`);
}

assert.match(html, /id="forge-logo"[^>]+src="local\/forge-logo\.png"/);
assert.match(html, /id="forge-favicon"[^>]+href="local\/forge-icon\.png"/);
assert.match(html, /light \? "local\/forge-logo-blue\.png" : "local\/forge-logo\.png"/);
assert.match(html, /light \? "local\/forge-icon-blue\.png" : "local\/forge-icon\.png"/);
assert.match(html, /function resolvedForgeTheme\(\)[\s\S]*?prefers-color-scheme: light/);
assert.match(html, /function applyForgeTheme\(\)[\s\S]*?updateForgeBranding\(\)/);

assert.doesNotMatch(html, />New Workout</);
assert.doesNotMatch(html, />NEW WORKOUT</);
assert.match(html, /id="new-workout-heading">Forge Workout</);
assert.match(html, /<p class="eyebrow">FORGE WORKOUT<\/p>/);
assert.match(html, /\$\("new-workout-heading"\)\.textContent = "Forge Workout"/);

for (const control of [
  /id="builder-details-continue"[^>]+class="btn primary/,
  /id="builder-preview"[^>]+class="btn secondary/,
  /id="builder-save"[^>]+class="btn primary/,
  /id="guided-section-continue"[^>]+class="btn primary/,
  /id="builder-review-back"[^>]+class="btn secondary/,
  /id="builder-review-save"[^>]+class="btn primary/,
  /id="start-blank-workout"[^>]+class="btn primary/,
]) assert.match(html, control);

assert.match(html, /--color-surface-overlay:\s*#18181df2/);
assert.match(html, /:root\[data-theme="light"\][\s\S]*?--color-surface-overlay:\s*#fffffff2/);
assert.match(html, /\.editor-open #new-workout-card \.workout-commit-actions[^\{]*\{[^}]*background:\s*var\(--color-surface-overlay\)/);
assert.match(html, /\.builder-review-exercise[^\{]*\{[^}]*border-bottom:\s*1px solid var\(--color-divider-subtle\)/);
assert.match(html, /\.editor-open #new-workout-card[^\{]*\{[^}]*box-shadow:\s*var\(--shadow-builder\)/);
assert.doesNotMatch(html, /\.editor-open #new-workout-card \.workout-commit-actions[^\{]*\{[^}]*background:\s*#18181d/);

assert.ok(contrast("ffffff", "2563eb") >= 4.5, "light-theme primary buttons must meet normal-text contrast");
assert.ok(contrast("111111", "f97316") >= 4.5, "dark-theme primary buttons must meet normal-text contrast");
assert.ok(contrast("475569", "ffffff") >= 4.5, "light-theme secondary builder text must remain readable");
assert.ok(contrast("9ca3af", "1d1e1f") >= 4.5, "dark-theme secondary builder text must remain readable");

console.log("Forge builder theme tests: branding, labels, controls, and light-mode surfaces passed");
