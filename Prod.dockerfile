FROM node:20.12.1 AS builder
LABEL maintainer="Ben Saufley<contact@bensaufley.com>"

WORKDIR /usr/src/audiobook-catalog
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force

COPY . .

ENV APP_ENV=prod
ENV NODE_ENV=production

RUN npm run build && \
  npm prune --production

FROM node:20.12.1-alpine

WORKDIR /usr/src/audiobook-catalog

COPY package.json package-lock.json ./

COPY --from=builder /usr/src/audiobook-catalog/node_modules ./node_modules
COPY --from=builder /usr/src/audiobook-catalog/.build ./.build

ENV APP_ENV=prod
ENV NODE_ENV=production

CMD [ "npm", "start" ]
