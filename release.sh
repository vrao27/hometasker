#!/usr/bin/env bash
set -euo pipefail

if [ -f .env ]; then
  # export every var in .env into the environment
  set -o allexport
  source .env
  set +o allexport
fi
count=$(git tag -l 'v[0-9]*' | wc -l | xargs)

next=$((count + 1))
VERSION="v${next}"
echo "🛠 Releasing ${VERSION}"

export VERSION
export DOCKERHUB_USERNAME 
if [ ! -f backend/.env ]; then
  mkdir -p backend
  touch backend/.env
fi

docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml push

if git rev-parse "$VERSION" >/dev/null 2>&1; then
  echo "Tag $VERSION already exists. Skipping tag creation."
else
  git tag "$VERSION"
  git push origin "$VERSION"
fi
echo "Published images with tag ${VERSION}"