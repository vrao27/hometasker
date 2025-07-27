#!/bin/bash
set -e
sudo apt-get update
sudo apt-get install -y docker.io git docker-compose-plugin

sudo usermod -aG docker ubuntu

cd /home/ubuntu

git clone https://github.com/vrao27/hometasker.git

sudo chown -R ubuntu:ubuntu /home/ubuntu/hometasker
