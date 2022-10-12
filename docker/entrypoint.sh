#!/bin/sh

WEBSOCKET_SCHEME="${WEBSOCKET_SCHEME:-ws://}" \
  WEBSOCKET_HOSTNAME="${WEBSOCKET_HOSTNAME:-${WEBSOCKET_HOST}}" \
  envsubst < /config.json.template > "/usr/share/nginx/html/config.json"
