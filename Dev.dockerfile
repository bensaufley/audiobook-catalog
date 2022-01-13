FROM node:16.13.1
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

WORKDIR /usr/src/audiobook-catalog
COPY yarn.lock package.json ./
RUN yarn install