#!/bin/bash
apt-get update -y

apt-get install -y docker.io
usermod -aG docker ubuntu
systemctl enable docker
systemctl start docker

DOCKER_COMPOSE_VERSION="2.24.6"
curl -SL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

docker --version
docker-compose --version

cd /home/ubuntu
git clone https://github.com/vrao27/hometasker.git
cd hometasker

chown -R ubuntu:ubuntu /home/ubuntu/hometasker

docker-compose up -d

docker ps -a

