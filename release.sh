#!/usr/bin/env bash
set -euo pipefail

if [ -f .env ]; then
  # export every var in .env into the environment
  set -o allexport
  source .env
  set +o allexport
fi

#add release tags v1, v2 etc
count=$(git tag -l 'v[0-9]*' | wc -l | xargs)
#version count 
next=$((count + 1))
VERSION="v${next}"
echo "🛠 Releasing ${VERSION}"
#added in .env file at root of project
export VERSION
export DOCKERHUB_USERNAME 
if [ ! -f backend/.env ]; then
  mkdir -p backend
  touch backend/.env
fi
docker compose \
  -f docker-compose.yml \  # Use the main compose file
  -f docker-compose.build.yml \  # Use the build override file
  build
docker compose \
  -f docker-compose.yml \  # Use the main compose file
  -f docker-compose.build.yml \  # Use the build override file
  push
#tag the realease in git rrepo
git tag "${VERSION}"
git push origin "${VERSION}"
echo "Published images with tag ${VERSION}"