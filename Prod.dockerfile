FROM node:14.14.0-slim AS builder
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

ENV NODE_ENV=development

WORKDIR /tmp/

# hadolint ignore=DL3008,DL3009
RUN apt-get update \
  && apt-get install -y --no-install-recommends git

COPY package.json yarn.lock script/docker /
RUN yarn install

RUN NODE_ENV=production yarn codegen
RUN NODE_ENV=production yarn build

RUN npm prune --production

FROM node:14.14.0-slim

ENV NODE_ENV=production
ENV ROOT_DIR=/usr/src/audiobook-catalog

WORKDIR /tmp
COPY script/docker ./scripts
RUN scripts/mongo-setup && rm -rf scripts

WORKDIR /usr/src/audiobook-catalog

COPY --from=builder \
  /tmp/package.json \
  /tmp/yarn.lock \
  /tmp/node_modules \
  /tmp/.build \
  /usr/src/audiobook-catalog/

EXPOSE 8080
