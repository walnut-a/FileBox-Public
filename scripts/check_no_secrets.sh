#!/bin/bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
scan_root="${1:-$repo_root}"
scan_root="$(cd "$scan_root" && pwd)"

secret_pattern='npm_[A-Za-z0-9]{36,}|ghp_[A-Za-z0-9_]{36,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{32,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|_authToken[[:space:]]*=[[:space:]]*[A-Za-z0-9_./-]{20,}'
violations=()

redact_path_if_needed() {
    local path_value="$1"
    if printf '%s' "$path_value" | grep -Eq "$secret_pattern"; then
        printf '<path contains sensitive value>'
    else
        printf '%s' "$path_value"
    fi
}

while IFS= read -r -d '' file_path; do
    relative_path="${file_path#$scan_root/}"

    if printf '%s' "$relative_path" | grep -Eq "$secret_pattern"; then
        violations+=("$(redact_path_if_needed "$relative_path")")
        continue
    fi

    if LC_ALL=C grep -Iq . "$file_path" && LC_ALL=C grep -Eq "$secret_pattern" "$file_path"; then
        violations+=("$(redact_path_if_needed "$relative_path")")
    fi
done < <(
    find "$scan_root" \
        \( -path "$scan_root/.git" \
        -o -path "$scan_root/node_modules" \
        -o -path "$scan_root/.npm" \
        -o -path "$scan_root/images" \
        -o -path "$scan_root/.DS_Store" \) -prune \
        -o -type f -print0
)

if [ "${#violations[@]}" -gt 0 ]; then
    echo "ERROR: 发现疑似 secret/token，请清理后再提交或发布。"
    printf ' - %s\n' "${violations[@]}" | sort -u
    exit 1
fi

echo "OK: 未发现疑似 secret/token。"
