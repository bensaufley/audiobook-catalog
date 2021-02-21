FROM node:14.14.0-buster-slim
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

ENV NODE_ENV=development

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /tmp

# hadolint ignore=DL3008,DL3009
RUN apt-get update \
  && apt-get install -y --no-install-recommends git

COPY script/docker ./scripts
RUN scripts/mongo-setup

COPY package.json yarn.lock /tmp/
RUN yarn install

WORKDIR /usr/src/audiobook-catalog
RUN mv /tmp/package.json /tmp/yarn.lock /tmp/node_modules /usr/src/audiobook-catalog/

COPY .eslintignore \
  .eslintrc.js \
  .gitignore \
  .graphql-codegen.yml \
  .prettierrc.js \
  babel.config.js \
  jest.config.ts \
  tsconfig.json \
  webpack.config.ts \
  /usr/src/audiobook-catalog/

EXPOSE 8080 8081 27017
