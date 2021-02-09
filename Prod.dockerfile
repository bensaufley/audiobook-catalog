FROM node:14.14.0-slim AS builder
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

ENV NODE_ENV=development

WORKDIR /tmp/

COPY package.json yarn.lock /
RUN yarn install

RUN NODE_ENV=production yarn build

RUN npm prune --production

FROM node:14.14.0-slim

ENV NODE_ENV=production
ENV ROOT_DIR=/usr/src/audiobook-catalog

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /mongo/

# hadolint ignore=DL3008
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    gnupg \
    libcurl4 \
    liblzma5  \
    openssl \
    wget \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
RUN wget -q https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.4.3.tgz
RUN wget -q https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.4.3.tgz.sig
RUN wget -q https://www.mongodb.org/static/pgp/server-4.4.asc \
  && gpg --import server-4.4.asc
RUN gpg --verify mongodb-linux-x86_64-debian10-4.4.3.tgz.sig mongodb-linux-x86_64-debian10-4.4.3.tgz
RUN tar -zxvf mongodb-linux-x86_64-debian10-4.4.3.tgz \
  && cp ./mongodb-linux-x86_64-debian10-4.4.3/bin/* /usr/local/bin/
RUN mkdir db

WORKDIR /usr/src/audiobook-catalog

COPY --from=builder \
  /tmp/package.json \
  /tmp/yarn.lock \
  /tmp/node_modules \
  /tmp/.build \
  /usr/src/audiobook-catalog/

EXPOSE 8080 27017 28017
