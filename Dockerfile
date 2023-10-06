FROM node:18-slim

USER root

RUN npm rm yarn -g

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY package.json package-lock.json file-content-injector.js /home/node/app/
RUN npm i

COPY . /home/node/app
RUN npm run build

RUN npm prune --production || true \
    npm cache clean -f

EXPOSE 3000
CMD ["npm", "start"]