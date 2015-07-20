FROM node:0.12

## Install forever
RUN npm install -g forever

## Set up application folder
RUN mkdir -p /app
WORKDIR /app

## Cache 3rd-party NPM modules
COPY package.json /app/
RUN npm install --production

## Copy source
COPY src /app/src

## TODO: Cachebust this section to ensure using latest dependencies
RUN npm install express-api-server@latest

## Run webapi service forever
CMD [ "forever", "-f", "src/api-server.js" ]

EXPOSE 8100
