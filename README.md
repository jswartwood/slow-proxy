Slow Proxy (for Node.js)
========================

The Slow Proxy module is used to stream an existing URL and adjust response time. It allows you to simulate server delays without creating redundant pages.

Install as dependency
---------------------

Install the module:

    npm install slow-proxy

...or...

Add to your `package.json` file:

    {
      "name":        "my-app",
      // ...
      "dependencies": {
        // ...
        "slow-proxy": "0.1.0"
      }
    }

Define your proxy configuration
-------------------------------

Require the module:

    var proxy = require("slow-proxy");

Set the hostname for the domain you would like to proxy:

    proxy.set("hostname", "www.my-other-app.com");

Using the `route` method with Express
-------------------------------------

This is the simplest way to leverage the module.  It will setup an Express route
on `/proxy/` (by default). The route technique requires the delay to be part of
the path; the delay is specified as the last "folder" before the proxied path.
For example: `www.my-new-app.com/proxy/3000/user/profile/me.html` will return
`www.my-other-app.com/user/profile/me.html` with a 3 second delay applied.

    proxy.route(app);

The second (optional) parameter of the route method can be designated to override
the base path. For example - to have your proxy work via the root path
(`www.my-new-app.com/3000/user/profile/me.html`):

    proxy.route(app, "/");

Using the `fetch` method
------------------------

Similar to the `route` example, but explicitly defined. The first parameter being
the original url to fetch, the second param being the delay value (in milliseconds),
and the third value being the callback function to run when the fetch completes.

    app.get(/\/proxy\/(\d+)\/(.*)$/, function(request, response) {
      // Call the `fetch` method
      var delay = request.params[0]
        , relativeOriginURL = request.params[1]
      ;
      proxy.fetch("/" + relativeOriginURL, delay, function( html ) {
        response.write(html);
        response.end();
      });
    });

License
-------

    * Copyright (c) 2012 Jacob Swartwood
    * Licensed under the MIT license
    * http://jacob.swartwood.info/license/
