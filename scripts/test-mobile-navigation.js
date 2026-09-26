#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "ui-components.css"), "utf8");

const mobileNav = html.match(/<nav id="mobile-nav"[\s\S]*?<\/nav>/)?.[0] || "";
assert.ok(mobileNav, "mobile navigation must exist");
assert.equal((mobileNav.match(/class="mobile-nav-item/g) || []).length, 5, "mobile navigation must contain five persistent destinations");
for (const label of ["Home", "Calendar", "Forge", "Progress", "More"]) assert.match(mobileNav, new RegExp(`<span>${label}</span>`));
assert.doesNotMatch(mobileNav, /<span>Search<\/span>/, "Search belongs in More, not the persistent bar");
assert.match(mobileNav, /class="mobile-nav-item mobile-nav-forge"[^>]*data-mobile-route="forge"/);
assert.match(mobileNav, /id="mobile-more-toggle"[^>]*aria-controls="mobile-more-menu"[^>]*aria-expanded="false"/);

const moreMenu = html.match(/<div id="mobile-more-menu"[\s\S]*?<\/div>/)?.[0] || "";
for (const [route, label] of [["library", "Search"], ["profile", "Profile"], ["settings", "Settings"]]) {
  assert.match(moreMenu, new RegExp(`data-mobile-more-route="${route}"[\\s\\S]*?<span>${label}</span>`));
}

assert.match(html, /document\.querySelectorAll\("\[data-mobile-route\]"\)[\s\S]*?openPrimaryRoute\(button\.dataset\.mobileRoute\)/);
assert.match(html, /document\.querySelectorAll\("\[data-mobile-more-route\]"\)[\s\S]*?openPrimaryRoute\(button\.dataset\.mobileMoreRoute\)/);
assert.match(html, /const moreRoutes = new Set\(\["library", "profile", "settings"\]\)/);
assert.match(html, /mobile-more-toggle[\s\S]*?moreRoutes\.has\(currentRoute\)/);
assert.match(html, /if \(sessionOpen\) setMobileMoreMenu\(false\)/);
assert.match(html, /event\.key === "Escape" && !\$\("mobile-more-menu"\)\.hidden/);

assert.match(css, /\.mobile-nav,\s*\n\.mobile-more-menu\s*\{\s*display:\s*none/);
const tabletStart = css.lastIndexOf("@media (max-width: 1024px)");
const phoneStart = css.lastIndexOf("@media (max-width: 650px)");
assert.ok(tabletStart >= 0 && phoneStart > tabletStart, "tablet and phone navigation must have separate responsive rules");
const tabletCss = css.slice(tabletStart, phoneStart);
const phoneCss = css.slice(phoneStart);
assert.match(tabletCss, /\.mobile-nav[\s\S]*?position:\s*fixed[\s\S]*?grid-template-columns:\s*repeat\(5/);
assert.match(tabletCss, /\.mobile-nav-forge[\s\S]*?background:\s*var\(--color-accent\)[\s\S]*?color:\s*var\(--color-on-accent\)/);
assert.match(tabletCss, /\.mobile-more-menu:not\(\[hidden\]\)[\s\S]*?display:\s*grid/);
assert.match(tabletCss, /\.primary-nav[\s\S]*?display:\s*none/);
assert.doesNotMatch(tabletCss, /data-menu-position/, "desktop side preference must not affect tablet navigation");
assert.match(html, /matchMedia\("\(max-width: 1024px\)"\)/, "iPad-width navigation must use the persistent mobile bar");
assert.match(phoneCss, /\.mobile-nav-item[\s\S]*?min-height:\s*48px/);
assert.match(phoneCss, /\.mobile-more-menu[\s\S]*?left:\s*12px/);

console.log("Forge mobile navigation tests: phone and tablet destinations, More menu, highlighting, and desktop isolation passed");
