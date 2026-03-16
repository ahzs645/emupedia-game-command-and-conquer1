#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

mkdir -p "$ROOT_DIR/js"

npx --yes browserify "$SCRIPT_DIR/js/App.js" --debug -o "$ROOT_DIR/js/refactor-app.js"
