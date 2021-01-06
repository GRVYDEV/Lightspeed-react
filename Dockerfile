# multistage - builder image
FROM node:alpine AS builder
WORKDIR /app/Lightspeed-react
COPY . .
RUN npm install

# configure ip, hardcoded to webrtc container address (8080) for now
RUN sed -i "s|stream.gud.software|localhost|g" public/config.json

# build it
RUN npm run build

# runtime image
FROM nginx:stable
COPY --from=builder /app/Lightspeed-react/build /usr/share/nginx/html
