#!/bin/bash
set -e

apt-get update
apt-get install -y docker.io git curl

systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu

DOCKER_COMPOSE_VERSION="2.24.6"
curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

cd /home/ubuntu
git clone https://github.com/vrao27/hometasker.git || true
chown -R ubuntu:ubuntu hometasker
cd hometasker
docker-compose pull
docker-compose up -d

docker ps -a
