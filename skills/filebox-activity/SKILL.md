---
name: filebox-activity
description: Use when a macOS user wants an agent to inspect FileBox common folders, monitored folders, or Recent Activity paths without modifying files.
---

# FileBox Activity

## Overview

FileBox provides a read-only `filebox` CLI for agents that need to see important folders and recent file changes. The CLI returns paths and metadata only; file operations remain the user's decision.

## Preconditions

- FileBox is installed on macOS.
- The command is installed from FileBox: `设置` -> `通用` -> `命令行工具` -> `安装`.
- Verify availability before using other commands:

```bash
filebox --capabilities --json
```

## Default Agent Flow

1. Confirm the CLI exists with `filebox --capabilities --json`.
2. Read configured folders with `filebox folders --json`.
3. Read recent activity with `filebox activity --focused --json --limit 20`.
4. Use `--all` only when the focused file extensions look too narrow.
5. Use `--refresh` only when the user says the cache looks stale, because refresh scans configured monitored folders.

## Quick Reference

| Goal | Command |
| --- | --- |
| Check capabilities | `filebox --capabilities --json` |
| List monitored folders | `filebox folders --json` |
| Read focused recent activity | `filebox activity --focused --json --limit 20` |
| Read all recent activity | `filebox activity --all --json --limit 50` |
| Get paths only | `filebox activity --focused --path-only --limit 20` |
| Limit by time | `filebox activity --focused --json --since 3d` |
| Refresh cache before reading | `filebox activity --focused --json --refresh --limit 20` |

## Output Shape

`filebox activity --focused --json` returns:

```json
{
  "schemaVersion": 1,
  "mode": "focused",
  "source": "cache",
  "groups": [
    {
      "title": "project-name",
      "directory": "/Users/name/GitHub/project-name",
      "itemCount": 2,
      "items": [
        {
          "fileName": "release-notes.md",
          "path": "/Users/name/GitHub/project-name/docs/release-notes.md",
          "directory": "/Users/name/GitHub/project-name/docs",
          "relativePath": "docs/release-notes.md"
        }
      ]
    }
  ]
}
```

## Rules

- Prefer `--json` for agent workflows.
- Treat the CLI as read-only. Do not delete, move, rename, copy, or edit files unless the user separately asks for that action.
- Prefer `--focused` first; it follows the user's configured file extensions such as `md`, `app`, or `dmg`.
- Use `--path-only` only when another tool needs a simple path list.
- If output is empty, report that FileBox has no matching cached activity instead of guessing.
- If `filebox` is missing, ask the user to install the CLI from FileBox settings.

## Common Mistakes

- Do not scan the whole home directory yourself before trying FileBox.
- Do not assume `--all` is better than `--focused`; focused mode is the user's curated view.
- Do not use `--refresh` in a tight loop.
