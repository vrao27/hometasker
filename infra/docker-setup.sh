#!/usr/bin/env bash
set -e

# 1) Install prerequisites
apt-get update
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# 2) Add Docker’s GPG key & repo
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor \
    -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list

# 3) Install Docker Engine + Compose plugin
apt-get update
apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-compose-plugin

# 4) (Optional) Provide old-style docker-compose command
ln -sf /usr/lib/docker/cli-plugins/docker-compose /usr/local/bin/docker-compose

# 5) Enable & start Docker
systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu

# 6) Switch to ubuntu’s home and clone/update your app
cd /home/ubuntu

git clone https://github.com/vrao27/hometasker.git hometasker || true
chown -R ubuntu:ubuntu hometasker

# 7) Build your .env
cat <<EOF > hometasker/.env
PORT=5000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/hometaskerDB
TOKEN_SECRET=$(head -c32 /dev/urandom | base64)
EOF
chown ubuntu:ubuntu hometasker/.env

# 8) Pull & run your Docker Compose stack
cd hometasker
export DOCKERHUB_USERNAME="satchrao"
export VERSION="v3"

docker compose pull
docker compose up -d

# 9) Show status
docker ps -a
