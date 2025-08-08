#! /usr/bin/env bash

docker load <$1
docker image ls -a

# umount polyfill-cache dir
sudo umount "$(pwd)/polyfill-cache" || true

docker compose down -v --remove-orphans
docker compose up -d

docker image prune -a -f
