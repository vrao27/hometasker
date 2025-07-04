#stahe 1 build stage
FROM ubuntu:22.04 AS build

# install curl, Node.js & npm
RUN apt-get update \
    && apt-get install -y curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

# Copy source (including .tsx/.ts files)
COPY public ./public
COPY src    ./src

# If you bake in your API URL at build time, uncomment:
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}



# Build production bundle (runs the TS compiler)
RUN npm run build


#stage 2: prod stage
FROM nginx:alpine

# Copy the build output to the Nginx html directory
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
