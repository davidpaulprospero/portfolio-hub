#!/usr/bin/env bash
#
# Build and deploy the static site to Cloudflare Pages.
#
# Usage:  ./scripts/deploy.sh
#
# Requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment.
# On Windows, set them once with `setx` and open a fresh terminal:
#
#   setx CLOUDFLARE_API_TOKEN "..."
#   setx CLOUDFLARE_ACCOUNT_ID "e014d724473cd7fdbee9950ec796db60"
#
# Note that `NEXT_PUBLIC_*` values are compiled into the client bundle at BUILD
# time, so they are read from .env.local here - not from the Cloudflare
# dashboard. The dashboard copies exist for a Git-triggered build, which this
# project does not use.

set -euo pipefail

cd "$(dirname "$0")/.."

# Read the vars out of the Windows user environment when run under Git Bash,
# since `setx` values are not inherited by an already-running shell.
if command -v powershell.exe >/dev/null 2>&1; then
  read_user_env() {
    powershell.exe -NoProfile -Command \
      "[Environment]::GetEnvironmentVariable('$1','User')" 2>/dev/null | tr -d '\r\n'
  }
  [ -n "${CLOUDFLARE_API_TOKEN:-}" ]  || CLOUDFLARE_API_TOKEN="$(read_user_env CLOUDFLARE_API_TOKEN)"
  [ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ] || CLOUDFLARE_ACCOUNT_ID="$(read_user_env CLOUDFLARE_ACCOUNT_ID)"
  export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID
fi

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] || [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "Missing Cloudflare credentials."
  echo
  echo "  setx CLOUDFLARE_API_TOKEN  \"...\""
  echo "  setx CLOUDFLARE_ACCOUNT_ID \"...\""
  echo
  echo "Token: dashboard.cloudflare.com > Profile > API Tokens"
  echo "Account ID: the 32-char hex in your dashboard URL."
  exit 1
fi

echo "Building..."
npm run build

echo
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy out \
  --project-name portfolio-hub \
  --branch main \
  --commit-dirty=true

echo
echo "Live at https://portfolio-hub-elv.pages.dev"
echo "Remember: verify on a real phone before sharing the link."