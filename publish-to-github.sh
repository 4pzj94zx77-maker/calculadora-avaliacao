#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="calculadora-avaliacao"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLISH_DIR="/private/tmp/${REPO_NAME}-publish"

command -v gh >/dev/null || {
  echo "GitHub CLI nao encontrado. Instale o gh e volte a executar."
  exit 1
}

gh auth status >/dev/null || {
  echo "Faca primeiro login no GitHub:"
  echo "gh auth login -h github.com"
  exit 1
}

OWNER="$(gh api user --jq .login)"
REPO_FULL_NAME="${OWNER}/${REPO_NAME}"
REPO_URL="https://github.com/${REPO_FULL_NAME}.git"

rm -rf "$PUBLISH_DIR"
mkdir -p "$PUBLISH_DIR"

rsync -a \
  --exclude ".git" \
  --exclude ".DS_Store" \
  --exclude "calculadora_avaliacao_webapp.zip" \
  "$SOURCE_DIR/" "$PUBLISH_DIR/"

cd "$PUBLISH_DIR"
git init -b main
git add .
git commit -m "Initial web app"

if gh repo view "$REPO_FULL_NAME" >/dev/null 2>&1; then
  git remote add origin "$REPO_URL"
else
  gh repo create "$REPO_FULL_NAME" --public --source=. --remote=origin
fi

git push -u origin main --force

gh api "repos/${REPO_FULL_NAME}/pages" \
  -X POST \
  -f "source[branch]=main" \
  -f "source[path]=/" >/dev/null 2>&1 || \
gh api "repos/${REPO_FULL_NAME}/pages" \
  -X PUT \
  -f "source[branch]=main" \
  -f "source[path]=/" >/dev/null

echo "Repositorio: https://github.com/${REPO_FULL_NAME}"
echo "App online: https://${OWNER}.github.io/${REPO_NAME}/"
