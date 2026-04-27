const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { installSkill, resolveDefaultTarget } = require("../lib/installer");

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "filebox-agent-skill-test-"));
}

test("resolveDefaultTarget uses CODEX_HOME when provided", () => {
  const target = resolveDefaultTarget({
    env: { CODEX_HOME: "/tmp/codex-home" },
    homedir: "/Users/example"
  });

  assert.equal(target, "/tmp/codex-home/skills/filebox-activity");
});

test("installSkill copies the FileBox activity skill into target directory", () => {
  const tempDir = makeTempDir();
  const target = path.join(tempDir, "skills", "filebox-activity");

  const result = installSkill({ target });

  assert.equal(result.target, target);
  assert.equal(result.status, "installed");
  assert.match(
    fs.readFileSync(path.join(target, "SKILL.md"), "utf8"),
    /name: filebox-activity/
  );
  assert.ok(fs.existsSync(path.join(target, "agents", "openai.yaml")));
});

test("installSkill refuses to overwrite an existing target unless forced", () => {
  const tempDir = makeTempDir();
  const target = path.join(tempDir, "skills", "filebox-activity");
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, "custom.txt"), "keep");

  assert.throws(
    () => installSkill({ target }),
    /already exists/
  );

  const result = installSkill({ target, force: true });

  assert.equal(result.status, "installed");
  assert.ok(!fs.existsSync(path.join(target, "custom.txt")));
  assert.ok(fs.existsSync(path.join(target, "SKILL.md")));
});
