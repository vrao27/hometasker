#stage 1: build

#Base Image
FROM ubuntu:22.04

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

# Copy source (including .tsx/.ts files)
COPY public ./public
COPY src    ./src

# If you bake in your API URL at build time, uncomment:
# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=${REACT_APP_API_URL}



# Build production bundle (runs the TS compiler)
RUN npm run build


#stage 2: prod stage
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
