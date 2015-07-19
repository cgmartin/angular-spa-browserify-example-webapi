# spa-api-server-example

[![Dependency Status](https://david-dm.org/cgmartin/angular-spa-browserify-example-webapi.svg)](https://david-dm.org/cgmartin/angular-spa-browserify-example-webapi)

## Synopsis

Demonstrates REST API endpoints for the
[angular-spa-browserify-example](https://github.com/cgmartin/angular-spa-browserify-example) client.

This API server is built on top of the [express-api-server](https://github.com/cgmartin/express-api-server) module,
which provides built-in web security, error handling, and logging.

It is part of a set of separate Node.js microservices (Static Web Server, Chat Server, Reverse Proxy) to demonstrate
a Single Page Web Application stack end-to-end, and is designed with portability and scalability in mind
(see [Twelve Factors](http://12factor.net/)).

Configuration options are passed in by the consumer or via environment variables at runtime.

## Features

* **/auth**: OAuth endpoints for login and JWT token refresh.
* **/logs**: Client to server logging.
* **/todos**: Example todo lists resource.

## Installation

1. Install [Node.js](https://nodejs.org/download/)
1. Install Gulp: `npm -g i gulp`
1. Clone this repo
1. Install dependencies: `npm i`
1. Start the app in dev mode: `npm run dev`
1. Point browser to <http://localhost:3000/>

After installation, the following actions are available:

* `npm run dev` : Builds for development, runs a local webserver, and watches for changes.
* `npm test` : Runs TypeScript file linting and unit tests once.
* `karma start` : Runs unit tests continuously, watching for changes.
* `npm run build` : Creates production client assets under the `dist/` folder, for deployment with a static webserver or CDN.

And run your `server.js` with optional runtime environment variables:
```bash
$ NODE_ENV=production API_SSL=1 API_PORT=443 node src/api-server.js
```

See [src/config.js](./src/config.js)
for configuration options to override.

### Default Environment Variables

* `API_BASE_URL` : Base url path for all endpoints (default: "/api").
* `API_USE_CLUSTER` : Use a node cluster module (throng) to create processes per CPU core.
* `API_HEAPDUMP` : Enable `heapdump` support (trigger dumps via `kill -USR2 {pid}`).
* `API_RDB_CONN` : RethinkDB connection string.
* `API_JWT_SECRET` : JSON Web Token Hash Secret. **NOTE:** You'll want to ensure this is unique per environment.
* `API_REV_PROXY` : The server is behind a reverse proxy when set to "1".
* `API_PORT` : The port to run on (default: 8000).
* `API_SSL` : Use a HTTPS server when set to "1". Enforces HTTPS by redirecting HTTP users when used with a reverse HTTP/HTTPS proxy.
* `API_SSL_KEY` : Path to the SSL key file.
* `API_SSL_CERT` : Path to the SSL cert file.

## Libraries & Tools

The functionality has been implemented by integrating the following 3rd-party tools and libraries:

 - [Express](https://github.com/strongloop/express): Fast, minimalist web framework for node
 - [Helmet](https://github.com/helmetjs/helmet): Secure Express apps with various HTTP headers
 - [Gulp](http://gulpjs.com/): Streaming build system and task runner
 - [Node.js](http://nodejs.org/api/): JavaScript runtime environment for server-side development
 - [Mocha](http://mochajs.org/): The fun, simple, flexible JavaScript test framework
 - [Chai](http://chaijs.com/): BDD/TDD assertion library for node and the browser
 - [Sinon](http://sinonjs.org/): Standalone test spies, stubs and mocks for JavaScript
 - [Mockery](https://github.com/mfncooper/mockery): Mock Node.js module dependencies during testing

## License

[MIT License](http://cgm.mit-license.org/)  Copyright © 2015 Christopher Martin
