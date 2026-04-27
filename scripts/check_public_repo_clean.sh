#!/bin/bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
private_remote_marker="filebox""-private"
private_source_root="/Users/zhaolixing/GitHub/""filebox"

required_files=(
    "README.md"
    "package.json"
    "bin/filebox-agent-skill.js"
    "lib/installer.js"
    "scripts/check_no_secrets.sh"
    "scripts/check_npm_package_no_secrets.sh"
    "docs/agent-cli-and-skill.md"
    "skills/filebox-activity/SKILL.md"
    "skills/filebox-activity/agents/openai.yaml"
)

blocked_paths=(
    ".build"
    ".swiftpm"
    "Package.swift"
    "Package.resolved"
    "Sources"
    "Tests"
    "Vendor"
)

for relative_path in "${required_files[@]}"; do
    if [ ! -f "$repo_root/$relative_path" ]; then
        echo "ERROR: 公开仓库缺少必要文件：$relative_path"
        exit 1
    fi
done

for relative_path in "${blocked_paths[@]}"; do
    if [ -e "$repo_root/$relative_path" ]; then
        echo "ERROR: 公开仓库出现不应该发布的工程路径：$relative_path"
        exit 1
    fi
done

if [ -f "$repo_root/.git/config" ] && grep -q "$private_remote_marker" "$repo_root/.git/config"; then
    echo "ERROR: 当前仓库 remote 指向私有仓库。"
    exit 1
fi

if grep -R \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=images \
    -F "$private_remote_marker" \
    "$repo_root" >/dev/null; then
    echo "ERROR: 公开仓库文本里出现私有仓库标记。"
    exit 1
fi

if grep -R \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=images \
    -F "$private_source_root" \
    "$repo_root" >/dev/null; then
    echo "ERROR: 公开仓库文本里出现本机私有源码路径。"
    exit 1
fi

echo "OK: 公开仓库内容检查通过。"
