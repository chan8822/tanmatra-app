#!/usr/bin/env node
/**
 * Tanmatra Build-Time Contract Tests
 * Run: node src/tests/build-contracts.cjs
 *
 * Prevents regressions in:
 * - Filter/segment tiles returning empty results against seed data
 * - Coupon codes referenced in UI strings not existing in the registry
 * - Categories with zero items
 */

const fs = require("fs");
const path = require("path");

let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("  FAIL:", msg); }
}

/* ── Parse seed data ── */
const menuPath = path.join(__dirname, "../data/menu.ts");
const menuSrc = fs.readFileSync(menuPath, "utf8");

// Categories
const categories = [];
const catRe = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let m;
while ((m = catRe.exec(menuSrc)) !== null) {
  if (menuSrc.slice(m.index, m.index + 120).includes("icon:")) {
    categories.push({ id: m[1], name: m[2] });
  }
}

// Menu items (single-line objects)
const menuItems = [];
for (const line of menuSrc.split("\n")) {
  if (line.trim().startsWith("{ id: \"") && line.includes("category_id:")) {
    menuItems.push({
      id:           (line.match(/id:\s*"([^"]+)"/)           || [0,""])[1],
      category_id:  (line.match(/category_id:\s*"([^"]+)"/)  || [0,""])[1],
      price:        parseInt((line.match(/price:\s*(\d+)/)    || [0,0])[1]),
      is_vegetarian: line.includes("is_vegetarian: true"),
      tags:         (line.match(/tags:\s*\[([^\]]*)\]/)       || [0,""])[1]
                      .split(",").map(t => t.replace(/["'\s]/g, "")).filter(Boolean),
      prep_time:    parseInt((line.match(/prep_time:\s*(\d+)/)|| [0,30])[1]),
      discount:     parseInt((line.match(/discount:\s*(\d+)/) || [0,0])[1]),
      rd_verified:  line.includes("rd_verified: true") || line.includes("is_rd_verified: true"),
      protein:      parseInt((line.match(/protein:\s*(\d+)/) || [0,0])[1]),
    });
  }
}

console.log("\nSeed dataset: " + menuItems.length + " items across " + categories.length + " categories\n");

/* ── SUITE 1: Category Coverage ── */
console.log("--- Suite 1: Category Coverage ---");
for (const cat of categories) {
  const count = menuItems.filter(i => i.category_id === cat.id).length;
  assert(count >= 1, cat.id + " has " + count + " items (expected >= 1)");
  console.log("  " + cat.id + ": " + count + " items OK");
}

/* ── SUITE 2: Filter Contracts ── */
console.log("\n--- Suite 2: Filter Contracts ---");
// NOTE: Keep in sync with src/lib/filters.ts NAMED_FILTERS
const WELLNESS_TAGS = ["Low Cal","Keto","Vit C","Immunity","Detox","Fiber+","Protein+","Balanced","Fitness"];
const FILTERS = {
  offers:     i => (i.discount || 0) > 0,
  quick:      i => (i.prep_time || 30) <= 15,
  wellness:   i => (i.tags || []).some(t => WELLNESS_TAGS.includes(t)),
  rdverified: i => i.rd_verified || i.is_rd_verified,
  family:     i => (i.price || 0) > 200,
  segment:    i => (i.protein || 0) > 15,
};
for (const [name, fn] of Object.entries(FILTERS)) {
  const results = menuItems.filter(fn);
  assert(results.length >= 1, "Filter \"" + name + "\" returns " + results.length + " items (expected >= 1)");
  console.log("  " + name + ": " + results.length + " items OK");
}

/* ── SUITE 3: Veg + Filter Conflicts ── */
console.log("\n--- Suite 3: Veg + Filter Conflicts ---");
for (const [name, fn] of Object.entries(FILTERS)) {
  const total = menuItems.filter(fn).length;
  const veg   = menuItems.filter(i => i.is_vegetarian && fn(i)).length;
  if (total > 0 && veg === 0) {
    console.log("  " + name + " + VEG: 0 veg results (warning: all matches are non-veg)");
  } else {
    console.log("  " + name + " + VEG: " + veg + " results OK");
  }
}

/* ── SUITE 4: Coupon Code Registry ── */
console.log("\n--- Suite 4: Coupon Code Registry ---");
const referralSrc = fs.readFileSync(path.join(__dirname, "../hooks/useReferral.ts"), "utf8");
const couponMatches = [...referralSrc.matchAll(/code:\s*"([A-Z0-9]+)"/g)];
const registryCodes = [...new Set(couponMatches.map(m => m[1]))];
console.log("  Registry: " + registryCodes.join(", "));

const uiCodes = new Set();
const codePattern = /\b(FIRST\d+|TAN\d+|GOLD\d+|WELCOME\d+|NEW\d+)\b/g;
const srcDir = path.join(__dirname, "..");

function scanDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "tests" && entry.name !== "api") {
      scanDir(full);
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      const content = fs.readFileSync(full, "utf8");
      let match;
      while ((match = codePattern.exec(content)) !== null) {
        const ctx = content.slice(Math.max(0, match.index - 50), match.index + 20);
        // Skip registry defs, generated patterns, placeholders
        if (ctx.includes('code:')) continue;
        if (ctx.includes('random') || ctx.includes('Math.')) continue;
        if (ctx.includes('substring') || ctx.includes('slice')) continue;
        if (ctx.includes('phone') || ctx.includes('user?.')) continue;
        if (ctx.includes('toUpperCase')) continue;
        if (ctx.includes('placeholder') || ctx.includes('e.g.')) continue;
        if (ctx.includes('example')) continue;
        uiCodes.add(match[1]);
      }
    }
  }
}
scanDir(srcDir);

console.log("  UI refs:  " + [...uiCodes].join(", "));
for (const code of uiCodes) {
  const exists = registryCodes.includes(code);
  assert(exists, "Coupon \"" + code + "\" in UI but NOT in registry");
  if (exists) console.log("  \"" + code + "\" -> registry OK");
}

/* ── Summary ── */
console.log("\n" + "=".repeat(50));
console.log("Results: " + passed + " passed, " + failed + " failed");
if (failed > 0) {
  console.error("\n[FAIL] BUILD BLOCKED. Fix failing tests before deploying.");
  process.exit(1);
} else {
  console.log("\n[PASS] All contracts verified. Build may proceed.");
  process.exit(0);
}
