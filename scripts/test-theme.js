#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const components = fs.readFileSync(path.join(root, "ui-components.css"), "utf8");

const darkTokens = html.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] || "";
const lightTokens = html.match(/:root\[data-theme="light"\]\s*\{([\s\S]*?)\n\}/)?.[1] || "";
const systemLight = html.match(/@media \(prefers-color-scheme: light\)\s*\{([\s\S]*?)\n\}/)?.[1] || "";

assert.match(darkTokens, /--color-accent:\s*#f97316/);
assert.match(darkTokens, /--color-accent-hover:\s*#ea580c/);
assert.match(lightTokens, /--color-accent:\s*#2563eb/);
assert.match(lightTokens, /--color-accent-hover:\s*#1d4ed8/);
assert.match(systemLight, /--color-accent:\s*#2563eb/);

for (const tokens of [darkTokens, lightTokens, systemLight]) {
  assert.match(tokens, /--color-pr:/, "each resolved theme must define achievement gold");
  assert.match(tokens, /--color-pr-text:/, "each resolved theme must define accessible achievement text");
}

assert.match(html, /--primary:\s*var\(--color-accent\)/);
assert.match(html, /--focus-ring:\s*0 0 0 3px var\(--color-accent-20\)/);
assert.match(html, /input\[type="checkbox"\][\s\S]*?accent-color:\s*var\(--color-accent\)/);
assert.match(html, /\.primary\s*\{[\s\S]*?background:\s*var\(--primary\)[\s\S]*?color:\s*var\(--color-on-accent\)/);
assert.match(components, /\.primary-nav-item\[aria-current="page"\][\s\S]*?color:\s*var\(--color-accent\)/);
assert.match(components, /\.action-button:is\(\.is-active, \[aria-pressed="true"\]\)[\s\S]*?background:\s*var\(--color-accent-12\)/);
assert.match(components, /a,\s*\n\.link-button[\s\S]*?color:\s*var\(--color-accent\)/);

assert.match(html, /\.pr-alert[^\{]*\{[\s\S]*?border:\s*1px solid var\(--color-pr\)/);
assert.match(html, /\.pr-badge[^\{]*\{[\s\S]*?background:\s*var\(--color-pr-background-strong\)/);
assert.doesNotMatch(html, /color:\s*#111(?:111)?\b/, "accent foregrounds must use the theme token");

assert.match(html, /forgeSettings\.theme === "system"\) document\.documentElement\.removeAttribute\("data-theme"\)/);
assert.match(html, /document\.documentElement\.dataset\.theme = forgeSettings\.theme/);
assert.match(html, /matchMedia\("\(prefers-color-scheme: light\)"\)/);
assert.match(html, /forgeSettings\.theme !== "system"\) return;[\s\S]*?updateForgeBranding\(\);[\s\S]*?requestAnimationFrame\(refreshThemeDependentVisuals\)/);

console.log("Forge theme tests: light blue, dark orange, and achievement gold rules passed");
