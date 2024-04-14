FROM node:20.12.1
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

WORKDIR /usr/src/audiobook-catalog
COPY package.json package-lock.json ./
RUN npm install && \
  npm cache clean --force
