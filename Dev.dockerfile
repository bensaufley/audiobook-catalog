FROM node:16.13.1
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

WORKDIR /usr/src/book-catalog
COPY yarn.lock package.json ./
RUN yarn install