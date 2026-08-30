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
  "filebox-main-window-hero-20260831.png"
);

test("website hero uses the latest screenshot without cropping it on mobile", () => {
  const appSource = fs.readFileSync(appSourcePath, "utf8");
  const styles = fs.readFileSync(stylesPath, "utf8");
  const mobileStyles = styles.slice(styles.indexOf("@media (max-width: 620px)"));

  assert.match(appSource, /filebox-main-window-hero-20260831\.png/);
  assert.ok(fs.existsSync(heroImagePath));
  assert.match(mobileStyles, /\.window-card\s*{[^}]*aspect-ratio:\s*auto;/s);
  assert.match(mobileStyles, /\.window-card img\s*{[^}]*height:\s*auto;/s);
  assert.match(mobileStyles, /\.window-card img\s*{[^}]*object-fit:\s*contain;/s);
  assert.doesNotMatch(mobileStyles, /\.window-card img\s*{[^}]*object-fit:\s*cover;/s);
});
