Slow Proxy (for Node.js)
========================

The Slow Proxy module is used to stream an existing URL and adjust response time. It allows you to simulate server delays without creating redundant pages.

Install as dependency
---------------------

Install the module:

```
npm install slow-proxy
```

Define your proxy configuration
-------------------------------

Require the module:

```javascript
var proxy = require("slow-proxy");
```

Set the hostname for the domain you would like to proxy:

```javascript
proxy.set("hostname", "www.my-other-app.com");
```

Using the `route` method with Express
-------------------------------------

This is the simplest way to leverage the module.  It will setup an Express route
on `/proxy/` (by default). The route technique requires the delay to be part of
the path; the delay is specified as the last "folder" before the proxied path.
For example: `www.my-new-app.com/proxy/5000/user/profile/me.html` will return
`www.my-other-app.com/user/profile/me.html` with a 5 second delay applied.

```javascript
// Express boilerplate
var express = require("express")
  , app = express()
;

// Include and configure slow-proxy
var proxy = require("slow-proxy");
proxy.set("hostname", "www.my-other-site.com");

// Setup automatic routing
proxy.route(app);

// Listen on port 3000
app.listen(3000);
```

The second (optional) parameter of the route method can be designated to override
the base path. For example - to have your proxy work via the root path
(`www.my-new-app.com/3000/user/profile/me.html`):

```javascript
proxy.route(app, "/");
```

Using the `fetch` method plain Node.js
--------------------------------------

Similar to the `route` example, but explicitly defined. The first parameter being
the original url to fetch, the second param being the delay value (in milliseconds),
and the third value being the callback function to run when the fetch completes.

```javascript
// Basic Node.js webserver boilerplate
var http = require("http")
  , url = require("url")
;

// Include and configure slow-proxy
var proxy = require("../lib/slow-proxy");
proxy.set("hostname", "www.my-other-site.com");

var app = http.createServer(function( req, res ) {
  var parsed_url = url.parse(req.url)
    , relative_url = parsed_url.pathname + (parsed_url.search || "")
    , matched_url = relative_url.match(/^\/proxy\/(\d+)(\/.+)$/)
    , delay
    , fetch_url
  ;

  if (matched_url) {
    // Extract data from the match
    delay = matched_url[1];
    fetch_url = matched_url[2];

    // Call the `fetch` method
    proxy.fetch(fetch_url, delay, function( html ) {
      // Forward the response html
      res.end(html);
    });
  }
});

// Listen on port 3000
app.listen(3000);
```

License
-------

    * Copyright (c) 2012 Jacob Swartwood
    * Licensed under the MIT license
    * http://jacob.swartwood.info/license/
