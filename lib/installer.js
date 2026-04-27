const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const skillName = "filebox-activity";
const packageRoot = path.resolve(__dirname, "..");
const defaultSource = path.join(packageRoot, "skills", skillName);

function resolveDefaultTarget(options = {}) {
  const env = options.env || process.env;
  const homedir = options.homedir || os.homedir();
  const codexHome = env.CODEX_HOME || path.join(homedir, ".codex");
  return path.join(codexHome, "skills", skillName);
}

function installSkill(options = {}) {
  const source = path.resolve(options.source || defaultSource);
  const target = path.resolve(options.target || resolveDefaultTarget(options));
  const force = Boolean(options.force);
  const dryRun = Boolean(options.dryRun);

  if (!fs.existsSync(path.join(source, "SKILL.md"))) {
    throw new Error(`Missing FileBox skill source: ${source}`);
  }

  if (fs.existsSync(target) && !force) {
    throw new Error(`Target already exists: ${target}. Re-run with --force to replace it.`);
  }

  if (dryRun) {
    return { status: "dry-run", source, target };
  }

  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });

  return { status: "installed", source, target };
}

function parseInstallArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--target") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--target requires a path.");
      }
      options.target = value;
      index += 1;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function printUsage() {
  console.log(`FileBox Agent Skill installer

Usage:
  npx filebox-agent-skill install [--force] [--target <path>]

Options:
  --force          Replace an existing filebox-activity skill directory.
  --target <path>  Install to a custom directory.
  --dry-run        Print the resolved install target without writing files.

Default target:
  $CODEX_HOME/skills/filebox-activity, or ~/.codex/skills/filebox-activity
`);
}

function main(args) {
  const [command, ...rest] = args;

  try {
    if (!command || command === "--help" || command === "-h" || command === "help") {
      printUsage();
      return;
    }

    if (command !== "install") {
      throw new Error(`Unknown command: ${command}`);
    }

    const result = installSkill(parseInstallArgs(rest));
    if (result.status === "dry-run") {
      console.log(`FileBox Activity skill would be installed to: ${result.target}`);
    } else {
      console.log(`FileBox Activity skill installed to: ${result.target}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  installSkill,
  main,
  resolveDefaultTarget
};
