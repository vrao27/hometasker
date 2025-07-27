#!/bin/bash
set -e
sudo apt-get update
sudo apt-get install -y docker.io git 

DOCKER_CONFIG=${DOCKER_CONFIG:-/home/ubuntu/.docker}
sudo mkdir -p $DOCKER_CONFIG/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
sudo chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

sudo usermod -aG docker ubuntu

cd /home/ubuntu

git clone https://github.com/vrao27/hometasker.git

sudo chown -R ubuntu:ubuntu /home/ubuntu/hometasker
