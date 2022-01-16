FROM node:16.13.1 AS builder
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

WORKDIR /usr/src/audiobook-catalog
COPY yarn.lock package.json ./
RUN yarn install && yarn cache clean

COPY . .

ENV APP_ENV=prod
ENV NODE_ENV=production

RUN yarn build:prod

# hadolint ignore=DL3059
RUN npm prune --production

FROM node:16.13.1

WORKDIR /usr/src/audiobook-catalog

COPY yarn.lock package.json ./

COPY --from=builder /usr/src/audiobook-catalog/node_modules ./node_modules
COPY --from=builder /usr/src/audiobook-catalog/.build ./.build

ENV APP_ENV=prod
ENV NODE_ENV=production

CMD [ "yarn", "start" ]