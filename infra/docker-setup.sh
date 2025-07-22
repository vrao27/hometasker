#!/usr/bin/env bash
set -e
exec >> /var/log/docker-setup.log 2>&1

# 0) Make sure 'sudo' is installed
apt-get update
apt-get install -y sudo

# 1) Install prerequisites & Docker Engine
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# 2) Add Docker’s official GPG key & apt repo
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) \
   signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
   https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable" \
   > /etc/apt/sources.list.d/docker.list

# 3) Install Docker + Compose plugin
apt-get update
apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin docker-compose-plugin



# 5) Add 'ubuntu' user to docker & sudo groups; enable passwordless sudo
usermod -aG docker,sudo ubuntu
echo "ubuntu ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/ubuntu-nopasswd
chmod 440 /etc/sudoers.d/ubuntu-nopasswd

# 6) Start Docker & wait until it's ready
systemctl enable docker
systemctl start docker

# 7) Clone or update your app repo
cd /home/ubuntu
git clone https://github.com/vrao27/hometasker.git hometasker || true
chown -R ubuntu:ubuntu hometasker

# 8) Build the .env file for interpolation
cat <<EOF > hometasker/.env
DOCKERHUB_USERNAME=satchrao
VERSION=v3
EOF
chown ubuntu:ubuntu hometasker/.env


cat <<EOF > hometasker/backend/.env
PORT=5000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/hometaskerDB
TOKEN_SECRET=$(head -c32 /dev/urandom | base64)
EOF
chown ubuntu:ubuntu hometasker/backend/.env

# 9) Pull & launch containers with Compose
cd hometasker
docker compose --env-file .env up -d --build


echo "📦 Containers launched:"
docker ps -a

