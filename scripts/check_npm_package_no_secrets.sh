#!/bin/bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
tmp_dir="$(mktemp -d)"

cleanup() {
    rm -rf "$tmp_dir"
}
trap cleanup EXIT

pack_json="$tmp_dir/pack.json"
(
    cd "$repo_root"
    npm pack --ignore-scripts --json --pack-destination "$tmp_dir" > "$pack_json"
)

tarball_name="$(PACK_JSON="$pack_json" node -e 'const fs = require("fs"); const data = JSON.parse(fs.readFileSync(process.env.PACK_JSON, "utf8")); console.log(data[0].filename);')"
extract_dir="$tmp_dir/extract"
mkdir -p "$extract_dir"
tar -xzf "$tmp_dir/$tarball_name" -C "$extract_dir"

"$script_dir/check_no_secrets.sh" "$extract_dir/package"
echo "OK: npm 发布包未发现疑似 secret/token。"
