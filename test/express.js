// Express boilerplate
var express = require("express")
  , app = express()
;

// Include and configure slow-proxy
var proxy = require("../lib/slow-proxy");
proxy.set("hostname", "www.my-other-site.com");

// Setup automatic routing
proxy.route(app);

// Listen on port 3000
app.listen(3000);
