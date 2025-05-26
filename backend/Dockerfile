#Base Image
FROM ubuntu:22.04

# Install Node.js and npm
RUN apt-get update \
    && apt-get install -y curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*



# Set the working directory
WORKDIR /app


# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install --production

#application code
COPY . .

# inject default .env from example file at build time
RUN cp .env.example .env

#entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# expose server port - process.env.PORT || 5000 in server.js
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
