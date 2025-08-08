# Reference: https://pnpm.io/docker#example-1-build-a-bundle-in-a-docker-container

FROM node:18-slim AS base
RUN apt-get update && \
    apt-get install curl -y --no-install-recommends
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN npm i --prod

FROM base AS build
RUN npm i
RUN npm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD ["npm", "start"]