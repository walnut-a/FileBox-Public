const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const checkScript = path.join(repoRoot, "scripts", "check_no_secrets.sh");

function makeFixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "filebox-public-secret-scan-"));
}

test("secret scan passes for safe public payloads", () => {
  const fixture = makeFixture();
  fs.writeFileSync(path.join(fixture, "README.md"), "FileBox public release notes\n");

  execFileSync(checkScript, [fixture], {
    cwd: repoRoot,
    stdio: "pipe"
  });
});

test("secret scan rejects npm tokens without printing the token value", () => {
  const fixture = makeFixture();
  const token = "npm_" + "A".repeat(40);
  fs.writeFileSync(path.join(fixture, "README.md"), `token=${token}\n`);

  assert.throws(
    () => execFileSync(checkScript, [fixture], { cwd: repoRoot, encoding: "utf8" }),
    (error) => {
      const output = `${error.stdout || ""}${error.stderr || ""}`;
      assert.match(output, /README\.md/);
      assert.doesNotMatch(output, new RegExp(token));
      return true;
    }
  );
});
