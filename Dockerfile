ARG ALPINE_VERSION=3.12
ARG NODE_VERSION=15

# multistage - builder image
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
WORKDIR /app/Lightspeed-react
# Layer caching for node modules
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# configure ip, hardcoded to webrtc container address (8080) for now
RUN sed -i "s|stream.gud.software|localhost|g" public/config.json

# build it
RUN npm run build

# runtime image
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}
USER 1000
COPY --from=builder --chown=1000 /app/Lightspeed-react/build /usr/share/nginx/html
