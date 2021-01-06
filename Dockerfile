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
FROM node:alpine
WORKDIR /app/
COPY --from=builder /app/Lightspeed-react/build ./build/
RUN npm install -g serve
# change port number if you want another port than 80
EXPOSE 80
CMD serve -s build -l 80