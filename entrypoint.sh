#!/bin/sh

publicDir=/usr/share/nginx/html
host=${WEBSOCKET_HOST:-localhost}

# configure ip, hardcoded to webrtc container address (8080) for now
sed -i "s|stream.gud.software|$host|g" "$publicDir/config.json"
exec /bin/sh "$@"
