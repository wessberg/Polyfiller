FROM node:10-alpine

ARG VERSION=latest

# Install deps
WORKDIR /polyfill

# Use node-gyp / python and install
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        git \
        g++ \
    && npm install @wessberg/polyfiller@${VERSION} --no-optional --production \
    && apk del .gyp git python make g++

# Add source files
COPY ./ .

CMD ["npm", "start"]
