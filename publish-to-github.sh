#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="calculadora-avaliacao"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLISH_DIR="$(mktemp -d "/private/tmp/${REPO_NAME}-publish.XXXXXX")"
trap 'rm -rf "$PUBLISH_DIR"' EXIT

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

if gh repo view "$REPO_FULL_NAME" >/dev/null 2>&1; then
  git clone "$REPO_URL" "$PUBLISH_DIR"
else
  mkdir -p "$PUBLISH_DIR"
  cd "$PUBLISH_DIR"
  git init -b main
  gh repo create "$REPO_FULL_NAME" --public --source=. --remote=origin
fi

rsync -a --delete \
  --exclude ".git" \
  --exclude ".DS_Store" \
  --exclude "calculadora_avaliacao_webapp.zip" \
  "$SOURCE_DIR/" "$PUBLISH_DIR/"

cd "$PUBLISH_DIR"
git add --all

if git diff --cached --quiet; then
  echo "Sem alterações para publicar."
else
  git commit -m "Update web app"
  git push -u origin main
fi

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
