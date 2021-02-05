FROM node:14.14.0-buster-slim
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

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

WORKDIR /tmp

COPY package.json yarn.lock /tmp/
RUN yarn install

WORKDIR /usr/src/audiobook-catalog
RUN mv /tmp/node_modules /usr/src/audiobook-catalog/

EXPOSE 8080 27017 28017
