#!/bin/sh

publicDir=/usr/share/nginx/html

envsubst < /config.json.template > "$publicDir/config.json"
