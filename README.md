# spa-api-server-example

[![Build Status](https://travis-ci.org/cgmartin/spa-api-server-example.svg?branch=master)](https://travis-ci.org/cgmartin/spa-api-server-example)
[![Dependency Status](https://david-dm.org/cgmartin/spa-api-server-example.svg)](https://david-dm.org/cgmartin/spa-api-server-example)

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

* **AngularJS HTML5 mode**: Catch all non-file routes and forward to index.html.
* **Security headers** using [Helmet](https://github.com/helmetjs/helmet) middleware.
* **Correlation ID Cookies**: Creates unique session and "conversation" (browser lifetime) cookies. Useful for tracking client API requests throughout a user's session lifetime.
* **SPA Boot Configuration**: JSONP launcher that provides runtime configuration for the client.
* **Graceful shutdown**: Listens for SIGTERM/SIGINT and unhandled exceptions, and waits for open connections to complete before exiting.
* **JSON format access logs**: Great for log analysis and collectors such as Splunk, Fluentd, Graylog, Logstash, etc.
* **Enforce HTTPS**: Redirects users from HTTP urls to HTTPS.
* **Pretty Print**: Format your JSON reponses using `?pretty=true` query param on any endpoint.

## Installation

1. Install [Node.js](https://nodejs.org/download/)
1. Install Gulp/Karma: `npm -g i gulp karma`
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
$ NODE_ENV=production STATIC_SSL=1 STATIC_PORT=443 node server.js
```

See [src/config.js](https://github.com/cgmartin/express-rest-api-server/blob/master/src/config.js)
for configuration options to override.

### Default Environment Variables

* `NODE_ENV` : Enables compression when set to "production".
* `STATIC_WEBROOT` : Path to the web root directory.
* `STATIC_INSTANCE` : The instance id of the server process, to be logged (default: "1").
* `STATIC_SESSION_MAXAGE` : The time in ms until the session ID cookie should expire (default: 2 hours). This is just a tracking cookie, no session storage is used here.
* `STATIC_REV_PROXY` : The server is behind a reverse proxy when set to "1".
* `STATIC_PORT` : The port to run on (default: 8000).
* `STATIC_SSL` : Use a HTTPS server when set to "1". Enforces HTTPS by redirecting HTTP users when used with a reverse HTTP/HTTPS proxy.
* `STATIC_SSL_KEY` : Path to the SSL key file.
* `STATIC_SSL_CERT` : Path to the SSL cert file.

## Folder Structure

```
├── coverage          # Coverage reports
├── example           # Example client assets for testing
└── src
    ├── middleware    # Express middleware
    ├── app.js        # Creates and configures an express app
    ├── config.js     # Configuration options
    ├── errors.js     # Error objects
    └── server.js     # (entrypoint) Starts the express app on a port
```

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
