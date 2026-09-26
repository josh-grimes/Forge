#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "ui-components.css"), "utf8");

assert.match(html, /<header[^>]*class="site-header"[\s\S]*?id="toggle-menu"[\s\S]*?<\/header>/);
assert.match(html, /<nav[^>]*id="primary-nav"[\s\S]*?class="sidebar-brand"[\s\S]*?id="close-menu"/);
assert.match(html, /id="close-menu"[^>]+aria-controls="primary-nav"[^>]+aria-label="Close menu"/);
assert.match(css, /body:not\(\.sidebar-closed\) #toggle-menu\s*\{\s*display:\s*none/);
assert.match(css, /\.sidebar-closed \.sidebar-close-button\s*\{\s*display:\s*none/);

assert.match(html, /<legend>Menu Position<\/legend>/);
assert.match(html, /name="menu-position" value="left"/);
assert.match(html, /name="menu-position" value="right"/);
assert.match(html, /menuPosition:\s*"left"/);
assert.match(html, /name="menu-position"\]:checked/);
assert.match(html, /document\.documentElement\.dataset\.menuPosition/);
assert.match(html, /localStorage\.setItem\(SETTINGS_KEY, JSON\.stringify\(forgeSettings\)\)/);

const desktopStart = css.indexOf("@media (min-width: 1025px)");
const mobileStart = css.indexOf("@media (max-width: 1024px)");
assert.ok(desktopStart >= 0 && mobileStart > desktopStart, "desktop menu rules must precede the separate mobile rules");
const desktopCss = css.slice(desktopStart, mobileStart);
const mobileCss = css.slice(mobileStart);
assert.match(desktopCss, /data-menu-position="right"\] \.primary-nav[\s\S]*?inset:\s*0 0 0 auto/);
assert.match(desktopCss, /data-menu-position="right"\] body\.sidebar-closed \.primary-nav[\s\S]*?translateX\(100%\)/);
assert.match(desktopCss, /data-menu-position="right"\] \.site-header[\s\S]*?margin-right:\s*260px/);
assert.match(desktopCss, /data-menu-position="right"\] main[\s\S]*?margin-right:\s*276px/);
assert.match(desktopCss, /data-menu-position="right"\] \.sidebar-brand[\s\S]*?row-reverse/);
assert.doesNotMatch(mobileCss, /data-menu-position/, "desktop side preference must not alter mobile navigation");
assert.match(mobileCss, /\.sidebar-close-button\s*\{\s*display:\s*none/);

assert.match(html, /\$\("close-menu"\)\.addEventListener\("click", \(\) => \{ setHeaderMenu\(false\); \$\("toggle-menu"\)\.focus\(\); \}\)/);
assert.match(html, /localStorage\.setItem\("forge-sidebar-open", String\(open\)\)/);
assert.match(html, /desktopMenuQuery\.addEventListener/);
assert.match(css, /\.primary-nav[\s\S]*?transition:\s*transform 180ms ease/);
assert.match(css, /\.site-header[\s\S]*?transition:\s*margin 180ms ease/);
assert.match(css, /main[\s\S]*?transition:\s*width 180ms ease, margin 180ms ease/);

console.log("Forge desktop menu tests: toggle placement, side preference, persistence, and responsive isolation passed");
