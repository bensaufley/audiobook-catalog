FROM node:18.7.0
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

WORKDIR /usr/src/audiobook-catalog
COPY yarn.lock package.json ./
RUN yarn install && yarn cache clean
