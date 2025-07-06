#!/usr/bin/env bash
set -euo pipefail

#add release tags v1, v2 etc
count=$(git tag -l 'v[0-9]*' | wc -l | xargs)
#version count 
next=$((count + 1))
VERSION="v${next}"
echo "🛠 Releasing ${VERSION}"
#added in .env file at root of project
export VERSION
export DOCKERHUB_USERNAME 
docker-compose build
docker-compose push
#tag the realease in git rrepo
git tag "${VERSION}"
git push origin "${VERSION}"
echo "✅ Published images with tag ${VERSION}"