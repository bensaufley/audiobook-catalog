FROM node:22.3.0
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

WORKDIR /usr/src/audiobook-catalog
COPY package.json package-lock.json ./
RUN npm install && \
  npm cache clean --force
