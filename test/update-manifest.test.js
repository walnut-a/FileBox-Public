const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(repoRoot, "site", "src", "data", "stable-release.json");
const appSourcePath = path.join(repoRoot, "site", "src", "App.tsx");
const sitePackagePath = path.join(repoRoot, "site", "package.json");

test("stable update manifest is valid and website imports it as the version source", () => {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const appSource = fs.readFileSync(appSourcePath, "utf8");
  const sitePackage = JSON.parse(fs.readFileSync(sitePackagePath, "utf8"));

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.channel, "stable");
  assert.match(manifest.version, /^\d+(?:\.\d+)+$/);
  assert.match(manifest.build, /^\d+(?:\.\d+)+$/);
  assert.equal(manifest.asset.sha256.length, 64);
  assert.ok(manifest.downloadPageURL.startsWith("https://"));
  assert.ok(manifest.releaseNotesURL.startsWith("https://"));

  assert.match(appSource, /import stableRelease from "\.\/data\/stable-release\.json"/);
  assert.match(appSource, /const currentVersion = stableRelease\.version/);
  assert.doesNotMatch(appSource, /const currentVersion = "\d/);
  assert.match(sitePackage.scripts.build, /copy-update-manifest\.mjs/);
});
