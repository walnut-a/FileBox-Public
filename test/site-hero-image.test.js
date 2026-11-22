const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const appSourcePath = path.join(repoRoot, "site", "src", "App.tsx");
const stylesPath = path.join(repoRoot, "site", "src", "styles.css");
const heroImagePath = path.join(
  repoRoot,
  "site",
  "public",
  "images",
  "filebox-main-window-hero-20261122.png"
);
const quickPanelImagePath = path.join(
  repoRoot,
  "site",
  "public",
  "images",
  "filebox-quick-window-20261122.png"
);

test("website hero uses the latest screenshot without cropping it on mobile", () => {
  const appSource = fs.readFileSync(appSourcePath, "utf8");
  const styles = fs.readFileSync(stylesPath, "utf8");
  const mobileStyles = styles.slice(styles.indexOf("@media (max-width: 620px)"));
  const windowCardImgStyles = styles.match(/\.window-card img\s*{[^}]*}/s)?.[0] ?? "";

  assert.match(appSource, /filebox-main-window-hero-20261122\.png/);
  assert.match(appSource, /filebox-quick-window-20261122\.png/);
  assert.ok(fs.existsSync(heroImagePath));
  assert.ok(fs.existsSync(quickPanelImagePath));
  assert.match(windowCardImgStyles, /clip-path:\s*inset\(2px round 20px\);/);
  assert.match(mobileStyles, /\.window-card\s*{[^}]*aspect-ratio:\s*auto;/s);
  assert.match(mobileStyles, /\.window-card img\s*{[^}]*height:\s*auto;/s);
  assert.match(mobileStyles, /\.window-card img\s*{[^}]*object-fit:\s*contain;/s);
  assert.doesNotMatch(mobileStyles, /\.window-card img\s*{[^}]*object-fit:\s*cover;/s);
});
