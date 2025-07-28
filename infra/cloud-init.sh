#!/bin/bash
set -e
sudo apt-get update
sudo apt-get install -y docker.io git 

sudo mkdir -p /usr/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64 -o /usr/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/lib/docker/cli-plugins/docker-compose

sudo usermod -aG docker ubuntu

cd /home/ubuntu
git clone https://github.com/vrao27/hometasker.git
cd hometasker

mkdir -p backend frontend

cat <<EOF > /home/ubuntu/hometasker/.env
DOCKERHUB_USERNAME=satchrao
VERSION=v3
EOF

cat <<EOF > /home/ubuntu/hometasker/backend/.env
MONGO_URI=mongodb://db:27017/
PORT=5000
TOKEN_SECRET=changeme
FRONTEND_URL=http://localhost:3000
EOF

cat <<EOF > /home/ubuntu/hometasker/frontend/.env
REACT_APP_API_URL=http://localhost:5000
EOF

sudo chown -R ubuntu:ubuntu /home/ubuntu/hometasker

cd /home/ubuntu/hometasker
sudo docker compose pull
sudo docker compose up -d