#!/usr/bin/env bash
SCOPE=wessberg
NAME=polyfiller

# Build latest
TAG=latest
docker build -t $NAME:$TAG -f ./Dockerfile .
docker tag $NAME:$TAG $SCOPE/$NAME
docker push $SCOPE/$NAME:$TAG

# Build latest specific version
VERSION=$(npm view @wessberg/polyfiller version)
TAG=$VERSION
docker build -t $NAME:$TAG --build-arg VERSION=$VERSION -f ./Dockerfile .
docker tag $NAME:$TAG $SCOPE/$NAME:$TAG
docker push $SCOPE/$NAME:$TAG